import ResetPasswordRequest from "@/components/ResetPasswordRequest";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Password Reset",
	description:
		"Reset your Squared account password to regain access to your tasks and projects.",
};

const ResetPasswordRequestPage = () => {
	return <ResetPasswordRequest />;
};

export default ResetPasswordRequestPage;
