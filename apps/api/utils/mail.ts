import bcrypt from "bcryptjs";
import {
	emailTemplate,
	joinWorkspaceTemplate,
	passwordResetTemplate,
} from "./templates";
import { createTransport } from "nodemailer";

const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const NEXT_PUBLIC_CONFIRM_URL = process.env.NEXT_PUBLIC_CONFIRM_URL;

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

export const sendMail = async (
	email: string,
	username: string,
	emailToken: string | undefined,
	confirmationRouteOption: string,
	workspace?: string,
	workspaceName?: string,
	type: "verify" | "invite" = "verify",
) => {
	try {
		const url =
			type === "verify"
				? `${NEXT_PUBLIC_CONFIRM_URL}/${confirmationRouteOption}/${emailToken}`
				: `${NEXT_PUBLIC_CONFIRM_URL}/login?token=${emailToken}`;
		let subject = "Confirm Email!";
		let htmlContent: string;

		if (confirmationRouteOption === "password") {
			// Settings for password reset email
			subject = "Password Reset Request";
			htmlContent = passwordResetTemplate(url);
		} else {
			// Settings for registration confirm email / workspace email
			htmlContent = workspace
				? joinWorkspaceTemplate(username, url, workspaceName)
				: emailTemplate(username, url);
			if (workspace) {
				subject = `Join ${workspaceName}!`;
			}
		}

		const sendResult = await transporter.sendMail({
			from: `"Squared" ${EMAIL_USERNAME}`,
			to: email,
			subject,
			html: htmlContent,
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
		console.error("Error sending email:", error);
		throw error;
	}
};
