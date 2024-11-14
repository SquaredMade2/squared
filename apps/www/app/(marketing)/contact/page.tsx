import { Background } from "@/components/background";
import { ContactForm } from "@/components/contact";
// import { FeaturedTestimonials } from "@/components/featured-testimonials";
// import { HorizontalGradient } from "@/components/horizontal-gradient";
// import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Contact Us - Squared",
	description:
		"Squared is a platform to help organize software development projects. Create new tasks, plan product goals, and setup milestones using Squared",
};

export default function PricingPage() {
	return (
		<div className="relative overflow-hidden py-20 md:py-0 px-4 md:px-20 bg-background">
			<div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
				<Background />
				<ContactForm />
				<div className="relative w-full z-20 hidden md:flex border-l border-neutral-100 dark:border-neutral-900 overflow-hidden items-center justify-center">
					<div className="max-w-sm mx-auto">
						{/* <FeaturedTestimonials /> */}
						{/* <p
							className={cn(
								"font-semibold text-xl text-center text-muted-foreground",
							)}
						>
							Squared is used by thousands of users
						</p> */}
						{/* <p
							className={cn(
								"font-normal text-base text-center text-neutral-500 dark:text-neutral-200 mt-8",
							)}
						>
							Need help or want to find out more? Send us an email!
						</p> */}
					</div>
					{/* <HorizontalGradient className="top-20" />
				<HorizontalGradient className="bottom-20" />
				<HorizontalGradient className="-right-80 transform rotate-90 inset-y-0 h-full scale-x-150" />
				<HorizontalGradient className="-left-80 transform rotate-90 inset-y-0 h-full scale-x-150" /> */}
				</div>
			</div>
		</div>
	);
}
