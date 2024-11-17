import { Background } from "@/components/background";
import { ContactForm } from "@/components/contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Contact Us - Squared",
	description:
		"Squared is a platform to help organize software development projects. Create new tasks, plan product goals, and setup milestones using Squared",
};

export default function ContactPage() {
	return (
		<div className="relative overflow-hidden py-20 md:py-0 px-4 md:px-20 bg-background">
			<div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
				<Background />
				<ContactForm />
			</div>
		</div>
	);
}
