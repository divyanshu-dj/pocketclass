export default function (req, res) {
	let nodemailer = require("nodemailer");

	//Put email address where you want receive the emails

	const toMailList = [
		"contact.pocketclass@gmail.com",
		"aliu5454@gmail.com",
		"chnouman49@gmail.com",
	];

	var message = {
		from: "contact.pocketclass@gmail.com",
		to: toMailList,
		...req.body,
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
