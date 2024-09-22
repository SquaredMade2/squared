import ResetPassword from "@/components/ResetPassword";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Password Reset",
	description:
		"Reset your Squared account password using the token to regain access to your tasks and projects.",
};

const ResetPasswordPage = () => {
	return <ResetPassword />;
};

export default ResetPasswordPage;
