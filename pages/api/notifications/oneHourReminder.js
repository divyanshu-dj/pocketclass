import { 
  getUserData, 
  getClassData, 
  checkAutomationEnabled,
  loadEmailTemplateWithAutomation,
  sendEmailToBookingRecipientsWithTracking,
  formatDateTime,
  generateBookingLinks,
  // Add the new timing helpers
  getAutomationTimeDelay,
  calculateSendTime
} from './notificationService';
import { db } from '../../../firebaseConfig';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import moment from 'moment-timezone';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('Starting class reminder process...');

    // Get all confirmed bookings
    const bookingsRef = collection(db, "Bookings");
    const q = query(bookingsRef, where("status", "==", "Confirmed"));
    const bookingsSnapshot = await getDocs(q);
    
    const bookings = bookingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`Found ${bookings.length} confirmed bookings`);

    let emailsSent = 0;
    let emailsScheduled = 0;
    const emailPromises = [];

    for (const booking of bookings) {
      try {
        // Skip if reminder already sent
        if (booking.classReminderSent) {
          continue;
        }

        // Get student, instructor, and class data
        const [studentData, instructorData, classData] = await Promise.all([
          getUserData(booking.student_id),
          getUserData(booking.instructor_id),
          getClassData(booking.class_id)
        ]);

        if (!studentData || !instructorData || !classData) {
          console.log(`Missing data for booking ${booking.id}, skipping...`);
          continue;
        }

        // Check if instructor has this automation enabled
        const isAutomationEnabled = await checkAutomationEnabled(
          booking.instructor_id, 
          'reminders', 
          'classReminder'
        );

        if (!isAutomationEnabled) {
          console.log(`Automation not enabled for instructor ${booking.instructor_id}, skipping...`);
          continue;
        }

        // Get custom timing for this automation (classReminder is premium)
        const timeDelay = await getAutomationTimeDelay(
          booking.instructor_id, 
          'reminders', 
          'classReminder'
        );
        
        // Calculate when this reminder should be sent based on class start time
        const sendTime = calculateSendTime(new Date(booking.startTime), timeDelay);
        const now = new Date();
        
        // Check if it's time to send the reminder
        const startTime = moment(booking.startTime).tz(booking.timezone || "America/Toronto", true);
        
        // Only send if the reminder time has passed but class hasn't started yet
        if (sendTime > now || startTime.isBefore(now)) {
          if (sendTime > now) {
            console.log(`Class reminder for booking ${booking.id} scheduled for ${sendTime}`);
            emailsScheduled++;
          }
          continue;
        }

        // Format time
        const { time: classTime } = formatDateTime(booking.startTime, booking.timezone);

        // Generate booking links
        const links = generateBookingLinks(booking.student_id, booking.id);

        // Prepare template data
        const templateData = {
          studentFirstName: studentData.firstName,
          studentLastName: studentData.lastName,
          instructorFirstName: instructorData.firstName,
          instructorLastName: instructorData.lastName,
          className: classData.Name,
          classTime: classTime,
          classDuration: `${classData.Duration || 60} minutes`,
          classLocation: classData.Location || 'Online',
          bookingId: booking.id,
          ...links
        };

        // Load email template (enhanced version, but free automations won't get coupon/message)
        const htmlContent = await loadEmailTemplateWithAutomation(
          'classReminder.html', 
          templateData,
          booking.instructor_id,
          'reminders',
          'classReminder'
        );
        
        if (!htmlContent) {
          console.error(`Failed to load template for booking ${booking.id}`);
          continue;
        }

        // Send email to all booking recipients (student + group emails)
        // This will track mail count for premium automations automatically
        const emailPromise = sendEmailToBookingRecipientsWithTracking(
          { ...booking, id: booking.id },
          studentData,
          `Class Starting Soon - ${classData.Name}`,
          htmlContent,
          booking.instructor_id,
          'reminders',
          'classReminder'
        ).then(async (result) => {
          if (result.success) {
            // Mark reminder as sent
            await updateDoc(doc(db, "Bookings", booking.id), {
              classReminderSent: true,
              classReminderSentAt: new Date()
            });
            emailsSent += (result.emailsSent || 1);
            console.log(`Class reminder sent for booking ${booking.id} to ${result.emailsSent || 1} recipient(s)`);
          } else {
            console.error(`Failed to send class reminder for booking ${booking.id}:`, result.error);
          }
          return result;
        });

        emailPromises.push(emailPromise);

      } catch (error) {
        console.error(`Error processing booking ${booking.id}:`, error);
      }
    }

    // Wait for all emails to be processed
    await Promise.all(emailPromises);

    console.log(`Class reminder process completed. Sent ${emailsSent} emails immediately, ${emailsScheduled} scheduled for later.`);

    return res.status(200).json({
      success: true,
      message: `Sent ${emailsSent} class reminder emails immediately, ${emailsScheduled} scheduled for later`,
      emailsSent,
      emailsScheduled,
      totalBookingsProcessed: bookings.length
    });

  } catch (error) {
    console.error('Error in class reminder handler:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send class reminders',
      error: error.message
    });
  }
}
