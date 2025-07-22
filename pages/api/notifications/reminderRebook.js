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
    console.log('Starting reminder to rebook process...');

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
          orderBy("startTime", "desc"),
          limit(1)
        );
        const userBookingsSnapshot = await getDocs(q);
        
        if (userBookingsSnapshot.empty) {
          continue; // No completed bookings
        }

        const lastBooking = userBookingsSnapshot.docs[0].data();
        const lastBookingId = userBookingsSnapshot.docs[0].id;

        // Check if it's been 21 days since last class
        const lastClassDate = moment(lastBooking.startTime);
        const daysSinceLastClass = moment().diff(lastClassDate, 'days');
        
        if (daysSinceLastClass < 21) {
          continue; // Not time for reminder yet
        }

        // Check if we already sent a rebook reminder recently (within 60 days)
        if (lastBooking.rebookReminderSentAt) {
          const lastReminderDate = moment(lastBooking.rebookReminderSentAt.toDate());
          const daysSinceReminder = moment().diff(lastReminderDate, 'days');
          
          if (daysSinceReminder < 60) {
            continue; // Already sent reminder recently
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
          'reminderRebook'
        );

        if (!isAutomationEnabled) {
          continue; // Automation not enabled
        }

        // Get custom timing for this automation (reminderRebook is premium)
        const timeDelay = await getAutomationTimeDelay(
          lastBooking.instructor_id, 
          'bookingBoost', 
          'reminderRebook'
        );
        
        // Calculate when this reminder should be sent
        // For rebook reminders, calculate from 21 days after the last class
        const baseReminderTime = moment(lastBooking.startTime).add(21, 'days').toDate();
        const sendTime = calculateSendTime(baseReminderTime, timeDelay);
        const now = new Date();
        
        // If the send time is in the future, skip for now (will be processed by scheduler)
        if (sendTime > now) {
          console.log(`Rebook reminder for user ${user.id} scheduled for ${sendTime}`);
          emailsScheduled++;
          continue;
        }

        // Format last class date
        const { date: lastClassDateFormatted } = formatDateTime(lastBooking.startTime);

        // Generate booking links
        const links = generateBookingLinks(user.id, lastBookingId);

        // Prepare template data
        const templateData = {
          studentFirstName: user.firstName,
          studentLastName: user.lastName,
          instructorFirstName: instructorData.firstName,
          instructorLastName: instructorData.lastName,
          lastClassName: classData.Name,
          lastClassDate: lastClassDateFormatted,
          daysSinceLastClass: daysSinceLastClass,
          instructorLink: `${process.env.NODE_ENV === 'production' ? 'https://www.pocketclass.ca' : 'http://localhost:3000'}/instructor/${lastBooking.instructor_id}`,
          ...links
        };

        // Load email template with automation enhancements
        const htmlContent = await loadEmailTemplateWithAutomation(
          'reminderRebook.html', 
          templateData,
          lastBooking.instructor_id,
          'bookingBoost',
          'reminderRebook'
        );
        
        if (!htmlContent) {
          console.error(`Failed to load template for user ${user.id}`);
          continue;
        }

        // Send email with tracking
        const emailPromise = sendEmailWithTracking(
          user.email,
          `Miss ${instructorData.firstName}? Time to Book Again!`,
          htmlContent,
          lastBooking.instructor_id,
          'bookingBoost',
          'reminderRebook',
          'PocketClass'
        ).then(async (result) => {
          if (result.success) {
            // Mark reminder as sent
            await updateDoc(doc(db, "Bookings", lastBookingId), {
              rebookReminderSentAt: new Date()
            });
            emailsSent++;
            console.log(`Rebook reminder sent to user ${user.id}`);
          } else {
            console.error(`Failed to send rebook reminder to ${user.id}:`, result.error);
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

    console.log(`Reminder to rebook process completed. Sent ${emailsSent} emails immediately, ${emailsScheduled} scheduled for later.`);

    return res.status(200).json({
      success: true,
      message: `Sent ${emailsSent} reminder to rebook emails immediately, ${emailsScheduled} scheduled for later`,
      emailsSent,
      emailsScheduled,
      totalUsersProcessed: users.length
    });

  } catch (error) {
    console.error('Error in reminder to rebook handler:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send reminder to rebook emails',
      error: error.message
    });
  }
}
