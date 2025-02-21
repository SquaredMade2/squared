import type { Logger } from "@squared/logger";
import { createTransport } from "nodemailer";

const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const transporter = createTransport({
	host: "smtp.office365.com",
	secure: false,
	tls: {
		ciphers: "SSLv3",
		rejectUnauthorized: false,
	},
	port: 587,
	auth: {
		user: EMAIL_USERNAME,
		pass: EMAIL_PASSWORD,
	},
});

export const sendMail = async ({
	email,
	subject,
	html,
	logger,
}: {
	email: string;
	subject: string;
	html: string;
	logger: Logger;
}) => {
	try {
		const sendResult = await transporter.sendMail({
			from: `"Squared" ${EMAIL_USERNAME}`,
			to: email,
			subject,
			html,
			attachments: [
				{
					filename: "sqLogo.png",
					path: `${__dirname}/asset/sqLogo.png`,
					cid: "sqLogo",
				},
				{
					filename: "sqBg.png",
					path: `${__dirname}/asset/sqBg.png`,
					cid: "sqBg",
				},
			],
		});
		return sendResult;
	} catch (error) {
		logger.error("Error sending email", error);
		throw error;
	}
};
