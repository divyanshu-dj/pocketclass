import { 
  getUserData, 
  getClassData, 
  checkAutomationEnabled,
  loadEmailTemplateWithAutomation,
  sendEmailWithTracking,
  formatDateTime,
  generateBookingLinks,
  // Add the new timing helpers
  getAutomationTimeDelay,
  calculateSendTime
} from './notificationService';
import { db } from '../../../firebaseConfig';
import { collection, getDocs, query, where, updateDoc, doc, orderBy, limit } from 'firebase/firestore';
import moment from 'moment-timezone';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('Starting win back lapsed students process...');

    // Get all users
    const usersRef = collection(db, "Users");
    const usersSnapshot = await getDocs(usersRef);
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    console.log(`Found ${users.length} total users`);

    let emailsSent = 0;
    let emailsScheduled = 0;
    const emailPromises = [];

    for (const user of users) {
      try {
        // Skip if user is an instructor or doesn't have email
        if (user.isInstructor || !user.email) {
          continue;
        }

        // Get user's bookings (completed ones)
        const bookingsRef = collection(db, "Bookings");
        const q = query(
          bookingsRef, 
          where("student_id", "==", user.id),
          where("status", "==", "Completed"),
          orderBy("startTime", "desc")
        );
        const userBookingsSnapshot = await getDocs(q);
        
        if (userBookingsSnapshot.empty) {
          continue; // No completed bookings
        }

        const lastBooking = userBookingsSnapshot.docs[0].data();
        const lastBookingId = userBookingsSnapshot.docs[0].id;
        const allBookings = userBookingsSnapshot.docs.map(doc => doc.data());

        // Check if it's been 60+ days since last class
        const lastClassDate = moment(lastBooking.startTime);
        const daysSinceLastClass = moment().diff(lastClassDate, 'days');
        
        if (daysSinceLastClass < 60) {
          continue; // Not lapsed yet
        }

        // Check if we already sent a win-back email recently (within 90 days)
        if (lastBooking.winBackEmailSentAt) {
          const lastWinBackDate = moment(lastBooking.winBackEmailSentAt.toDate());
          const daysSinceWinBack = moment().diff(lastWinBackDate, 'days');
          
          if (daysSinceWinBack < 90) {
            continue; // Already sent win-back email recently
          }
        }

        // Get instructor and class data for the last booking
        const [instructorData, classData] = await Promise.all([
          getUserData(lastBooking.instructor_id),
          getClassData(lastBooking.class_id)
        ]);

        if (!instructorData || !classData) {
          continue;
        }

        // Check if instructor has this automation enabled
        const isAutomationEnabled = await checkAutomationEnabled(
          lastBooking.instructor_id, 
          'bookingBoost', 
          'winBackLapsed'
        );

        if (!isAutomationEnabled) {
          continue; // Automation not enabled
        }

        // Get custom timing for this automation (winBackLapsed is premium)
        const timeDelay = await getAutomationTimeDelay(
          lastBooking.instructor_id, 
          'bookingBoost', 
          'winBackLapsed'
        );
        
        // Calculate when this email should be sent
        const sendTime = calculateSendTime(new Date(), timeDelay);
        const now = new Date();
        
        // If the send time is in the future, skip for now (will be processed by scheduler)
        if (sendTime > now) {
          console.log(`Win-back email for user ${user.id} scheduled for ${sendTime}`);
          emailsScheduled++;
          continue;
        }

        // Calculate stats
        const totalClassesCompleted = allBookings.length;
        
        // Find favorite instructor (most frequent)
        const instructorCounts = {};
        allBookings.forEach(booking => {
          instructorCounts[booking.instructor_id] = (instructorCounts[booking.instructor_id] || 0) + 1;
        });
        const favoriteInstructorId = Object.keys(instructorCounts).reduce((a, b) => 
          instructorCounts[a] > instructorCounts[b] ? a : b
        );
        const favoriteInstructorData = favoriteInstructorId === lastBooking.instructor_id ? 
          instructorData : await getUserData(favoriteInstructorId);

        // Format last class date
        const { date: lastClassDateFormatted } = formatDateTime(lastBooking.startTime);

        // Generate booking links
        const links = generateBookingLinks(user.id, lastBookingId);

        // Prepare template data
        const templateData = {
          studentFirstName: user.firstName,
          studentLastName: user.lastName,
          daysSinceLastClass: daysSinceLastClass,
          lastClassName: classData.Name,
          lastClassDate: lastClassDateFormatted,
          totalClassesCompleted: totalClassesCompleted,
          favoriteInstructorName: favoriteInstructorData ? 
            `${favoriteInstructorData.firstName} ${favoriteInstructorData.lastName}` : 
            `${instructorData.firstName} ${instructorData.lastName}`,
          favoriteInstructorFirstName: favoriteInstructorData ? 
            favoriteInstructorData.firstName : instructorData.firstName,
          newInstructorCategories: 'Yoga, Pilates, and Fitness',
          newClassCount: '15',
          favoriteInstructorLink: `${process.env.NODE_ENV === 'production' ? 'https://www.pocketclass.ca' : 'http://localhost:3000'}/instructor/${favoriteInstructorId}`,
          ...links
        };

        // Load email template with automation enhancements
        const htmlContent = await loadEmailTemplateWithAutomation(
          'winBackLapsed.html', 
          templateData,
          lastBooking.instructor_id,
          'bookingBoost',
          'winBackLapsed'
        );
        
        if (!htmlContent) {
          console.error(`Failed to load template for user ${user.id}`);
          continue;
        }

        // Send email with tracking
        const emailPromise = sendEmailWithTracking(
          user.email,
          `We Miss You ${user.firstName}! Come Back with 30% Off`,
          htmlContent,
          lastBooking.instructor_id,
          'bookingBoost',
          'winBackLapsed',
          favoriteInstructorData ? 
            `${favoriteInstructorData.firstName} from PocketClass` : 
            "PocketClass"
        ).then(async (result) => {
          if (result.success) {
            // Mark win-back email as sent
            await updateDoc(doc(db, "Bookings", lastBookingId), {
              winBackEmailSentAt: new Date()
            });
            emailsSent++;
            console.log(`Win-back email sent to user ${user.id}`);
          } else {
            console.error(`Failed to send win-back email to ${user.id}:`, result.error);
          }
          return result;
        });

        emailPromises.push(emailPromise);

      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
      }
    }

    // Wait for all emails to be processed
    await Promise.all(emailPromises);

    console.log(`Win back lapsed students process completed. Sent ${emailsSent} emails immediately, ${emailsScheduled} scheduled for later.`);

    return res.status(200).json({
      success: true,
      message: `Sent ${emailsSent} win back lapsed student emails immediately, ${emailsScheduled} scheduled for later`,
      emailsSent,
      emailsScheduled,
      totalUsersProcessed: users.length
    });

  } catch (error) {
    console.error('Error in win back lapsed students handler:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send win back lapsed student emails',
      error: error.message
    });
  }
}
