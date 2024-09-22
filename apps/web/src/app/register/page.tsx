import RegisterForm from "@/components/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Register",
	description:
		"Create your Squared account to gain access to powerful task management features.",
};

const RegisterFormPage = () => {
	return <RegisterForm />;
};

export default RegisterFormPage;
