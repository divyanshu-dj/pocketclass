import { db } from '../../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Helper function to convert Firestore Timestamp to Date
const timestampToDate = (timestamp) => {
  if (!timestamp) return null;
  
  // Handle Firestore Timestamp objects
  if (timestamp.seconds && typeof timestamp.seconds === 'number') {
    return new Date(timestamp.seconds * 1000);
  }
  
  // Handle Date objects
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  // Handle ISO strings
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  
  // Handle timestamp objects with toDate method
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  return null;
};

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
    port: 465,
    host: "smtp.gmail.com",
  });
};

// Get user data
export const getUserData = async (userId) => {
  try {
    const docRef = doc(db, "Users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Get class data
export const getClassData = async (classId) => {
  try {
    const docRef = doc(db, "classes", classId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching class data:', error);
    return null;
  }
};

// Get booking data
export const getBookingData = async (bookingId) => {
  try {
    const docRef = doc(db, "Bookings", bookingId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: bookingId, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching booking data:', error);
    return null;
  }
};

// Define which automations are free vs premium (matches frontend logic)
const isFreeAutomation = (category, automationType) => {
  // Only these two automations are free
  return (
    (category === 'reminders' && automationType === 'upcomingClass') || // 24 hours reminder
    (category === 'classUpdates' && automationType === 'newBooking')    // New Booking notification
  );
};

// Check if automation is enabled for instructor
export const checkAutomationEnabled = async (instructorId, category, automationType) => {
  try {
    const instructorData = await getUserData(instructorId);
    if (!instructorData) return false;
    
    // Check if this is a premium automation and user doesn't have premium access
    if (!isFreeAutomation(category, automationType)) {
      const today = new Date();
      const premiumExpire = timestampToDate(instructorData.premiumExpire);
      
      if (!premiumExpire || premiumExpire < today) {
        return false;
      }
    }
    
    // Check if automation is enabled
    return instructorData.automations?.[category]?.[automationType]?.enabled || false;
  } catch (error) {
    console.error('Error checking automation status:', error);
    return false;
  }
};

// Get automation time delay for specific instructor and automation
export const getAutomationTimeDelay = async (instructorId, category, automationType) => {
  try {
    const instructorData = await getUserData(instructorId);
    if (!instructorData) return null;
    
    // Check if automation is enabled
    const isEnabled = await checkAutomationEnabled(instructorId, category, automationType);
    if (!isEnabled) return null;
    
    // Get custom time or fallback to default
    const customTime = instructorData.automations?.[category]?.[automationType]?.customTime;
    const timeDelay = instructorData.automations?.[category]?.[automationType]?.timeDelay;
    
    return customTime || timeDelay || getDefaultTimeDelay(category, automationType);
  } catch (error) {
    console.error('Error getting automation time delay:', error);
    return null;
  }
};

// Convert time delay string to milliseconds
export const convertTimeDelayToMs = (timeDelay) => {
  const timeMap = {
    'immediate': 0,
    '15min': 15 * 60 * 1000,
    '30min': 30 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '2h': 2 * 60 * 60 * 1000,
    '3h': 3 * 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '12h': 12 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '2d': 2 * 24 * 60 * 60 * 1000,
    '3d': 3 * 24 * 60 * 60 * 1000,
    '1week': 7 * 24 * 60 * 60 * 1000,
    '2weeks': 14 * 24 * 60 * 1000,
    '3weeks': 21 * 24 * 60 * 1000,
    '4weeks': 28 * 24 * 60 * 1000,
    '6weeks': 42 * 24 * 60 * 1000,
    '8weeks': 56 * 24 * 60 * 1000,
    '3months': 90 * 24 * 60 * 1000,
    '6months': 180 * 24 * 60 * 1000
  };
  
  return timeMap[timeDelay] || timeMap['24h']; // Default to 24h if unknown
};

// Get default time delay for automation types
export const getDefaultTimeDelay = (category, automationType) => {
  const defaults = {
    reminders: {
      upcomingClass: '24h',
      classReminder: '1h'
    },
    classUpdates: {
      newBooking: 'immediate',
      rescheduled: 'immediate',
      cancelled: 'immediate'
    },
    engagement: {
      thankYouVisit: 'immediate'
    },
    bookingBoost: {
      reminderRebook: '3weeks',
      winBackLapsed: '8weeks'
    },
    milestones: {
      welcomeNew: 'immediate',
      birthdayGreeting: 'immediate'
    }
  };
  
  return defaults[category]?.[automationType] || 'immediate';
};

// Calculate exact send time based on booking time and delay
export const calculateSendTime = (bookingStartTime, timeDelay) => {
  const delayMs = convertTimeDelayToMs(timeDelay);
  const startTime = new Date(bookingStartTime);
  
  if (timeDelay.includes('week') || timeDelay.includes('month')) {
    // For post-class delays, add to the start time
    return new Date(startTime.getTime() + delayMs);
  } else {
    // For pre-class delays, subtract from the start time
    return new Date(startTime.getTime() - delayMs);
  }
};

// Enhanced load email template with automation data
export const loadEmailTemplateWithAutomation = async (templateFile, templateData, instructorId, category, automationType) => {
  try {
    // Get coupon code and personal message if applicable
    const couponCode = await getAutomationCouponCode(instructorId, category, automationType);
    const personalMessage = await getAutomationPersonalMessage(instructorId, category, automationType);
    
    // Add automation data to template data
    const enhancedTemplateData = {
      ...templateData,
      couponCode: couponCode,
      personalMessage: personalMessage,
      hasCouponCode: couponCode ? 'true' : 'false',
      hasPersonalMessage: personalMessage ? 'true' : 'false'
    };
    
    return loadEmailTemplate(templateFile, enhancedTemplateData);
  } catch (error) {
    console.error('Error loading enhanced email template:', error);
    return loadEmailTemplate(templateFile, templateData); // Fallback to basic template
  }
};

// Load and populate email template
export const loadEmailTemplate = (templateFile, templateData) => {
  try {
    const templatePath = path.join(process.cwd(), 'email-templates', templateFile);
    
    if (!fs.existsSync(templatePath)) {
      console.error('Template not found:', templateFile);
      return null;
    }

    let templateContent = fs.readFileSync(templatePath, 'utf-8');
    
    // Handle conditional sections first (before variable replacement)
    // Handle {{#hasVariable}} ... {{/hasVariable}} conditionals
    const conditionalRegex = /\{\{\#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;
    templateContent = templateContent.replace(conditionalRegex, (match, variable, content) => {
      const value = templateData[variable];
      // Show content if variable is truthy and not empty string
      if (value && value !== '' && value !== 'false') {
        return content;
      }
      return '';
    });
    
    // Handle {{^hasVariable}} ... {{/hasVariable}} inverse conditionals  
    const inverseConditionalRegex = /\{\{\^(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;
    templateContent = templateContent.replace(inverseConditionalRegex, (match, variable, content) => {
      const value = templateData[variable];
      // Show content if variable is falsy or empty string
      if (!value || value === '' || value === 'false') {
        return content;
      }
      return '';
    });
    
    // Replace template variables
    Object.keys(templateData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      templateContent = templateContent.replace(regex, templateData[key] || '');
    });

    return templateContent;
  } catch (error) {
    console.error('Error loading email template:', error);
    return null;
  }
};

// Send email
export const sendEmail = async (to, subject, htmlContent, fromName = "PocketClass") => {
  try {
    const transporter = createTransporter();
    
    const message = {
      from: `${fromName} <contact.pocketclass@gmail.com>`,
      to: to,
      subject: subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(message);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send email with tracking (increments mail count for automations)
export const sendEmailWithTracking = async (to, subject, htmlContent, instructorId, category, automationType, fromName = "PocketClass") => {
  try {
    // Send the email first
    const emailResult = await sendEmail(to, subject, htmlContent, fromName);
    
    // If email sent successfully, increment the counter for ALL automations (free and premium)
    if (emailResult.success) {
      await incrementAutomationMailCount(instructorId, category, automationType);
    }
    
    return emailResult;
  } catch (error) {
    console.error('Error sending email with tracking:', error);
    return { success: false, error: error.message };
  }
};

// Send email to group (handles both individual and group bookings)
export const sendEmailToBookingRecipients = async (booking, studentData, subject, htmlContent, fromName = "PocketClass") => {
  try {
    const emails = [];
    
    // Always include the primary student email
    if (studentData?.email) {
      emails.push(studentData.email);
    }
    
    // Add group emails if they exist and are different from primary email
    if (booking.groupEmails && Array.isArray(booking.groupEmails)) {
      booking.groupEmails.forEach(email => {
        if (email && email.trim() && !emails.includes(email.trim())) {
          emails.push(email.trim());
        }
      });
    }
    
    if (emails.length === 0) {
      console.error('No valid email addresses found for booking:', booking.id);
      return { success: false, error: 'No valid email addresses found' };
    }
    
    console.log(`Sending email to ${emails.length} recipient(s) for booking ${booking.id}:`, emails);
    
    const transporter = createTransporter();
    const emailPromises = [];
    const results = [];
    
    for (const email of emails) {
      const message = {
        from: `${fromName} <contact.pocketclass@gmail.com>`,
        to: email,
        subject: subject,
        html: htmlContent,
      };
      
      const emailPromise = transporter.sendMail(message)
        .then(result => {
          console.log(`Email sent successfully to ${email}:`, result.messageId);
          results.push({ email, success: true, messageId: result.messageId });
          return result;
        })
        .catch(error => {
          console.error(`Error sending email to ${email}:`, error);
          results.push({ email, success: false, error: error.message });
          throw error;
        });
      
      emailPromises.push(emailPromise);
    }
    
    try {
      await Promise.all(emailPromises);
      
      return { 
        success: true, 
        emailsSent: emails.length,
        recipients: emails,
        results: results.filter(r => r.success),
        messageId: results.find(r => r.success)?.messageId
      };
    } catch (error) {
      // Even if some emails failed, check if any succeeded
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;
      
      if (successCount > 0) {
        console.warn(`Partial success: ${successCount} emails sent, ${failureCount} failed`);
        return { 
          success: true, 
          partialSuccess: true,
          emailsSent: successCount,
          failures: failureCount,
          recipients: emails,
          results: results,
          messageId: results.find(r => r.success)?.messageId
        };
      } else {
        console.error('All emails failed to send');
        return { 
          success: false, 
          error: 'All emails failed to send',
          results: results
        };
      }
    }
    
  } catch (error) {
    console.error('Error in sendEmailToBookingRecipients:', error);
    return { success: false, error: error.message };
  }
};

// Send email to booking recipients with tracking (for automations)
export const sendEmailToBookingRecipientsWithTracking = async (booking, studentData, subject, htmlContent, instructorId, category, automationType, fromName = "PocketClass") => {
  try {
    // Send the emails first
    const emailResult = await sendEmailToBookingRecipients(booking, studentData, subject, htmlContent, fromName);
    
    // If emails sent successfully, increment the counter for ALL automations (free and premium)
    if (emailResult.success) {
      await incrementAutomationMailCount(instructorId, category, automationType);
    }
    
    return emailResult;
  } catch (error) {
    console.error('Error sending email to booking recipients with tracking:', error);
    return { success: false, error: error.message };
  }
};

// Format date and time
export const formatDateTime = (dateTime, timezone = 'America/Toronto') => {
  const date = new Date(dateTime);
  return {
    date: date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: timezone 
    }),
    time: date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true,
      timeZone: timezone 
    })
  };
};

// Generate booking links
export const generateBookingLinks = (studentId, bookingId) => {
  const baseUrl = process.env.NODE_ENV === 'production' ? 'https://www.pocketclass.ca' : 'http://localhost:3000';
  
  return {
    rescheduleLink: `${baseUrl}/mybooking?id=${studentId}&bookingId=${bookingId}&mode=reschedule`,
    cancelLink: `${baseUrl}/mybooking?id=${studentId}&bookingId=${bookingId}&mode=cancel`,
    classDetailsLink: `${baseUrl}/mybooking?id=${studentId}&bookingId=${bookingId}`,
    contactLink: `${baseUrl}/support`,
    rebookLink: `${baseUrl}/mybooking`,
    reviewLink: `${baseUrl}/review?bookingId=${bookingId}`,
    bookAgainLink: `${baseUrl}/mybooking?id=${studentId}&bookingId=${bookingId}&mode=bookAgain`,
    exploreClassesLink: `${baseUrl}/browse`,
    bookingLink: `${baseUrl}/browse`,
    instructorProfileLink: `${baseUrl}/instructor/profile`,
    comebackBookingLink: `${baseUrl}/browse`,
    browseInstructorsLink: `${baseUrl}/browse`,
    favoriteInstructorLink: `${baseUrl}/instructor/profile`,
    browseClassesLink: `${baseUrl}/browse`,
    helpCenterLink: `${baseUrl}/support`,
    supportLink: `${baseUrl}/support`
  };
};

// Get automation coupon code for specific instructor and automation
export const getAutomationCouponCode = async (instructorId, category, automationType) => {
  try {
    const instructorData = await getUserData(instructorId);
    if (!instructorData) return '';
    
    // Check if automation is enabled
    const isEnabled = await checkAutomationEnabled(instructorId, category, automationType);
    if (!isEnabled) return '';
    
    // Only return coupon code for premium users on premium automations (free automations can't have coupons)
    if (isFreeAutomation(category, automationType)) {
      return '';
    }
    
    return instructorData.automations?.[category]?.[automationType]?.couponCode || '';
  } catch (error) {
    console.error('Error getting automation coupon code:', error);
    return '';
  }
};

// Get automation personal message for specific instructor and automation
export const getAutomationPersonalMessage = async (instructorId, category, automationType) => {
  try {
    const instructorData = await getUserData(instructorId);
    if (!instructorData) return '';
    
    // Check if automation is enabled
    const isEnabled = await checkAutomationEnabled(instructorId, category, automationType);
    if (!isEnabled) return '';
    
    // Only return personal message for premium users on premium automations (free automations can't have personal messages)
    if (isFreeAutomation(category, automationType)) {
      return '';
    }
    
    return instructorData.automations?.[category]?.[automationType]?.personalMessage || '';
  } catch (error) {
    console.error('Error getting automation personal message:', error);
    return '';
  }
};

// Update automation mail count (for statistics)
export const incrementAutomationMailCount = async (instructorId, category, automationType) => {
  try {
    const instructorData = await getUserData(instructorId);
    if (!instructorData) return false;
    
    const currentCount = instructorData.automations?.[category]?.[automationType]?.mailsSent || 0;
    
    // Update the mail count in the database
    const updateData = {
      [`automations.${category}.${automationType}.mailsSent`]: currentCount + 1,
      updatedAt: new Date()
    };
    
    await updateDoc(doc(db, "Users", instructorId), updateData);
    return true;
  } catch (error) {
    console.error('Error incrementing automation mail count:', error);
    return false;
  }
};
