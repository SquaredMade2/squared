import { Background } from "@/components/background";
import { Container } from "@/components/container";
import { Features } from "@/components/features";
import { GridFeatures } from "@/components/grid-features";
import { Hero } from "@/components/hero";
import { Testimonials } from "@/components/testimonials";
import { createClient } from "@/prismicio";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Squared",
	description:
		"Squared is a platform to help organize software development projects. Create new tasks, plan product goals, and setup milestones using Squared",
	openGraph: {
		images: ["/banner.png"],
	},
};

export default async function Home() {
	const client = createClient();
	const { data } = await client.getSingle("home");
	return (
		<div className="relative overflow-hidden ">
			<Background />
			<Container className="flex min-h-screen flex-col items-center justify-between ">
				<Hero
					title={data.hero_title}
					description={data.hero_description}
					cta={data.hero_cta}
				/>
				{/* <Companies /> */}
				<Features />
				<GridFeatures />
				<Testimonials />
			</Container>
			<div className="relative">
				<Background />
				{/* <CTA /> */}
			</div>
		</div>
	);
}
