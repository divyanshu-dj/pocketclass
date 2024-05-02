import stripe from '../../utils/stripe';
import { db } from '../../firebaseConfig';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { getDateOnly } from '../../utils/date';
import moment from 'moment';
function sendEmail(targetEmail, targetSubject, targetText, now) {
	let nodemailer = require("nodemailer");

	//Put email address where you want receive the emails

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
        text: `${targetText} \n\nTime:${moment(now)?.format?.(
            "DD-MM-YY / hh:mm A"
        )}`,

        
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
        
        // Set current date minus 7 days
        const currentDateMinusSevenDays = new Date();
        // currentDateMinusSevenDays.setDate(currentDateMinusSevenDays.getDate() +1);
        currentDateMinusSevenDays.setDate(currentDateMinusSevenDays.getDate() - 7);
        const totalTransfers = appointmentData.length;
        console.log("Current date: " + new Date());
        console.log("Current date minus 7 days: " + currentDateMinusSevenDays);
        console.log("Running transfers for " + totalTransfers + " appointments...")
        appointmentData.forEach(async (appointment,index) => {
            if(appointment.paid !== false) return;
            console.log(appointment.end);
            const appointmentEnd =appointment.end.toDate();
            console.log("Appointment " + index+1 + " ended on: " + appointmentEnd);
            // Check if the appointment ended 7 or more days ago
            if(appointmentEnd <= currentDateMinusSevenDays) {
                console.log("Creating transfer for appointment " + index+1 + "...");
                const instructorId = appointment.instructor;
                // Get the instructor's stripe account from the database
                console.log(appointment)
                const instructor = await getDoc(doc(db, 'Users', instructorId));
                const instructorData = instructor.data();
                const instructorStripeAccountId = instructorData.stripeAccountId;
                const price = appointment.price;

                // Calculate the application fee and payable amount
                const application_fee_amount = price * 0.2;
                const payable_amount = price - application_fee_amount;

                // Create a transfer to the instructor
                const transfer = await stripe.transfers.create({
                    amount: payable_amount * 100, // Assuming 'price' is in dollars, and Stripe requires cents
                    currency: "cad",
                    destination: instructorStripeAccountId,
                });
                console.log('Transfer created:', transfer);
                // Update the appointment to mark it as paid
                await updateDoc(doc(db, 'appointments', appointment.id), {
                    paid: true,
                });
                const targetText = `Congratulations! Your payment  for Appointment: ${appointment.title} for the amount of ${payable_amount}$  has been cleared. You can now withdraw the amount to your bank account from your wallet.`;
				// Send an email to the instructor
                await sendEmail(instructorData.email, 'Payment Cleared', targetText, new Date());
                console.log("Transfer created for appointment " + index+1 );
            }
            else
            {
                console.log("Appointment " + index+ " ended less than 7 days ago. Skipping transfer creation.");
            }
        });

        // It's not clear where 'paymentIntent.client_secret' is set. Please ensure it is correctly obtained before using it.
        res.status(200).json({
            "message": "Transfers created successfully",
        });
    } catch (error) {
        console.error("Error creating Stripe session:", error);
        res.status(500).json({ error: "Error creating Stripe session" });
    }
}
