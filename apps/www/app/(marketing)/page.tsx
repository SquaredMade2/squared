import { Container } from "@/components/container";
import { Hero } from "@/components/hero";
import { Background } from "@/components/background";
import { Features } from "@/components/features";
import { GridFeatures } from "@/components/grid-features";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
	return (
		<div className="relative overflow-hidden ">
			<Background />
			<Container className="flex min-h-screen flex-col items-center justify-between ">
				<Hero />
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
