import { db } from '../../firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import moment from 'moment';

function sendEmail(targetEmail, targetSubject, targetText, now) {
    let nodemailer = require("nodemailer");

    //Put email address where you want to receive the emails
    const toMailList = [
        "contact.pocketclass@gmail.com",
        "aliu5454@gmail.com",
        "chnouman49@gmail.com",
        targetEmail,
    ];

    var message = {
        from: "contact.pocketclass@gmail.com",
        to: toMailList,
        subject: targetSubject,
        text: `${targetText} \n\nTime:${moment(now).format("DD-MM-YY / hh:mm A")}`,
    };

    nodemailer
        .createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
            port: 465,
            host: "smtp.gmail.com",
        })
        .sendMail(message, (err) => {
            if (err) {
                console.warn(err);
                res.status(400).json({ err: err });
            } else {
                res.status(200).json("Email Sent");
            }
        });
}

export default async function (req, res) {
    try {
        const appointments = await getDocs(collection(db, 'appointments'));
        const appointmentData = appointments.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Set current date and tomorrow's date
        const currentDate = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(currentDate.getDate() + 1);

        const currentDateMinusSevenDays = new Date();
        currentDateMinusSevenDays.setDate(currentDateMinusSevenDays.getDate() - 7);

        for (const appointment of appointmentData) {

            const appointmentStart = appointment.start.toDate();
            if (appointmentStart.toDateString() === tomorrow.toDateString()) {
                console.log("Sending reminder email for appointment:", appointment);
                const ownerId = appointment.owner;
                const owner = await getDoc(doc(db, 'Users', ownerId));
                const ownerData = owner.data();
                const targetEmail = ownerData.email;

                const reminderText = `Reminder: You have an appointment titled "${appointment.title}" starting tomorrow at ${moment(appointmentStart).format("hh:mm A")}.`;
                await sendEmail(targetEmail, 'Appointment Reminder', reminderText, new Date());
                console.log("Reminder email sent for appointment:", appointment);
            }
        }

        res.status(200).json({
            "message": "Transfers created and reminders sent successfully",
        });
    } catch (error) {
        console.error("Error processing appointments:", error);
        res.status(500).json({ error: "Error processing appointments" });
    }
}
