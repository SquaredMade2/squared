import { Background } from "@/components/background";
import { ContactForm } from "@/components/contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
	metadataBase: new URL("https://www.squaredmade.com"),
	title: "Contact Us - Squared",
	description:
		"Squared is a platform to help organize software development projects. Create new tasks, plan product goals, and setup milestones using Squared",
};

export default function ContactPage() {
	return (
		<div className="relative overflow-hidden bg-background px-4 py-20 md:px-20 md:py-0">
			<div className="relative grid min-h-screen w-full grid-cols-1 overflow-hidden md:grid-cols-2">
				<Background />
				<ContactForm />
			</div>
		</div>
	);
}
