import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
	title: "Login",
	description:
		"Securely log in to your Squared account to manage your tasks and collaborate with your team.",
};

export default function Login() {
	return (
		<div className="flex items-center justify-center min-h-screen min-w-full p-4">
			<Suspense fallback={<div>Loading...</div>}>
				<LoginForm />
			</Suspense>
		</div>
	);
}
