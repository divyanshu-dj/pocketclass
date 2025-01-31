import { db } from "../../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import moment from "moment-timezone";

async function sendReviewEmail(appointment, classData) {
  try {
    let nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
      port: 465,
      host: "smtp.gmail.com",
    });

    if (!appointment.student_id || !appointment.class_id) {
      console.log("Appointment or class not found!");
      return;
    }

    const studentRef = doc(db, "Users", appointment?.student_id);
    if (!studentRef) {
      return;
    }
    const studentSnapshot = await getDoc(studentRef);
    if (!studentSnapshot.exists()) {
      console.log("Student not found!");
      return;
    }
    const studentData = studentSnapshot.data();
    if (!studentData) {
      return;
    }

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
            <h2>How was your PocketClass session?</h2>
            <p>Hi ${studentData.firstName} ${studentData.lastName},</p>
            <p>Thank you for completing ${classData?.Name}! We truly appreciate your time and trust, and we hope you enjoyed the learning experience.</p>
            <p>Would you mind taking a moment to share your feedback? Your review helps other students make informed decisions.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.pocketclass.ca/classes/id=${appointment.class_id}#review" 
                   style="background-color: #E73F2B; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">
                    Write a Review
                </a>
            </div>
            <p>Best regards,<br>The PocketClass Team</p>
        </div>
    `;

    const message = {
      from: "contact.pocketclass@gmail.com",
      to: studentData?.email,
      subject: "Share Your PocketClass Experience",
      html: htmlContent,
    };

    const appointmentRef = doc(db, "Bookings", appointment.id);
    await updateDoc(appointmentRef, {
      reviewEmailSent: true,
    });

    return transporter.sendMail(message);
  } catch (error) {
    console.error("Error sending review email:", error);
  }
}

export default async function handler(req, res) {

  try {
    const currentTime = moment();

    // Get all appointments
    const appointmentsRef = collection(db, "Bookings");
    const appointmentsSnapshot = await getDocs(appointmentsRef);
    const appointments = appointmentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const classesRef = collection(db, "classes");
    const classesSnapshot = await getDocs(classesRef);
    const classes = classesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const completedAppointments = appointments.filter((appointment) => {
      const endTime = moment(appointment.endTime).tz(appointment.timezone || "America/Toronto", true);
      const now = moment().tz(appointment.timezone || "America/Toronto");
      return endTime.isBefore(now) && !appointment.reviewEmailSent;
    });

    // Send review emails
    const emailPromises = completedAppointments.map((appointment) =>
      sendReviewEmail(
        appointment,
        classes.find((c) => c.id === appointment.class_id)
      )
    );

    await Promise.all(emailPromises);

    return res.status(200).json({
      success: true,
      message: `Sent ${completedAppointments.length} review request emails`,
    });
  } catch (error) {
    console.error("Error sending review emails:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send review emails",
      error: error.message,
    });
  }
}
