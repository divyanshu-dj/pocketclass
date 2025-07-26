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
import { updateDoc, doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ success: false, message: 'Booking ID is required' });
  }

  try {
    console.log(`Processing thank you notification for booking: ${bookingId}`);

    // Get booking data
    const bookingRef = doc(db, "Bookings", bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (!bookingSnap.exists()) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const booking = { id: bookingId, ...bookingSnap.data() };

    // Check if thank you email already sent
    if (booking.thankYouEmailSent) {
      return res.status(200).json({ 
        success: true, 
        message: 'Thank you email already sent',
        alreadySent: true 
      });
    }

    // Get student, instructor, and class data
    const [studentData, instructorData, classData] = await Promise.all([
      getUserData(booking.student_id),
      getUserData(booking.instructor_id),
      getClassData(booking.class_id)
    ]);

    if (!studentData || !instructorData || !classData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required data (student, instructor, or class)' 
      });
    }

    // Check if instructor has this automation enabled
    const isAutomationEnabled = await checkAutomationEnabled(
      booking.instructor_id, 
      'engagement', 
      'thankYouVisit'
    );

    if (!isAutomationEnabled) {
      return res.status(200).json({ 
        success: true, 
        message: 'Thank you automation not enabled for this instructor',
        automationDisabled: true 
      });
    }

    // Get custom timing for this automation (thankYouVisit is premium)
    const timeDelay = await getAutomationTimeDelay(
      booking.instructor_id, 
      'engagement', 
      'thankYouVisit'
    );
    
    // Calculate when this email should be sent based on class completion time
    const classEndTime = new Date(booking.startTime);
    // Add class duration to get end time
    const classDuration = classData.Duration || 60;
    classEndTime.setMinutes(classEndTime.getMinutes() + classDuration);
    
    const sendTime = calculateSendTime(classEndTime, timeDelay);
    const now = new Date();
    
    // If the send time is in the future, return early (will be processed by scheduler)
    if (sendTime > now) {
      console.log(`Thank you email for booking ${bookingId} scheduled for ${sendTime}`);
      return res.status(200).json({
        success: true,
        message: `Thank you email scheduled for ${sendTime}`,
        scheduled: true,
        scheduledFor: sendTime
      });
    }

    // Format date
    const { date: classDate } = formatDateTime(booking.startTime, booking.timezone);

    // Generate booking links
    const links = generateBookingLinks(booking.student_id, booking.id);

    // Prepare template data
    const templateData = {
      studentFirstName: studentData.firstName,
      studentLastName: studentData.lastName,
      instructorFirstName: instructorData.firstName,
      instructorLastName: instructorData.lastName,
      className: classData.Name,
      classDate: classDate,
      classDuration: `${classData.Duration || 60} minutes`,
      bookingId: booking.id,
      reviewLink: `${process.env.NODE_ENV === 'production' ? 'https://www.pocketclass.ca' : 'http://localhost:3000'}/review?bookingId=${bookingId}&instructorId=${booking.instructor_id}`,
      bookAgainLink: `${process.env.NODE_ENV === 'production' ? 'https://www.pocketclass.ca' : 'http://localhost:3000'}/instructor/${booking.instructor_id}`,
      ...links
    };

    // Load email template with automation enhancements
    const htmlContent = await loadEmailTemplateWithAutomation(
      'thankYouVisit.html', 
      templateData,
      booking.instructor_id,
      'engagement',
      'thankYouVisit'
    );
    
    if (!htmlContent) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to load email template' 
      });
    }

    // Send email to all booking recipients (student + group emails) with tracking
    const emailResult = await sendEmailToBookingRecipientsWithTracking(
      booking,
      studentData,
      `Thank You for Attending - ${classData.Name}`,
      htmlContent,
      booking.instructor_id,
      'engagement',
      'thankYouVisit'
    );

    if (emailResult.success) {
      // Mark email as sent
      await updateDoc(bookingRef, {
        thankYouEmailSent: true,
        thankYouEmailSentAt: new Date()
      });

      console.log(`Thank you notification sent for booking ${bookingId}`);

      return res.status(200).json({
        success: true,
        message: 'Thank you notification email sent successfully',
        emailsSent: emailResult.emailsSent || 1,
        recipients: emailResult.recipients,
        messageId: emailResult.messageId,
        partialSuccess: emailResult.partialSuccess || false
      });
    } else {
      console.error(`Failed to send thank you notification for ${bookingId}:`, emailResult.error);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to send thank you notification email',
        error: emailResult.error
      });
    }

  } catch (error) {
    console.error('Error in thank you notification handler:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send thank you notification',
      error: error.message
    });
  }
}
