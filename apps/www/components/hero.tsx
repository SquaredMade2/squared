"use client";

import Balancer from "react-wrap-balancer";
import { Button } from "./button";
import { HiArrowRight } from "react-icons/hi2";
import { Badge } from "./badge";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Link } from "next-view-transitions";

export const Hero = () => {
	const { theme, setTheme } = useTheme();
	const router = useRouter();
	return (
		<div className="flex flex-col min-h-screen pt-20 md:pt-40 relative overflow-hidden">
			<motion.div
				initial={{
					y: 40,
					opacity: 0,
				}}
				animate={{
					y: 0,
					opacity: 1,
				}}
				transition={{
					ease: "easeOut",
					duration: 0.5,
				}}
				className="flex justify-center"
			>
				<Badge onClick={() => router.push("https://app.squaredmade.com/login")}>
					See what it&apos;s about
				</Badge>
			</motion.div>
			<motion.h1
				initial={{
					y: 40,
					opacity: 0,
				}}
				animate={{
					y: 0,
					opacity: 1,
				}}
				transition={{
					ease: "easeOut",
					duration: 0.5,
				}}
				className="text-2xl md:text-4xl lg:text-8xl font-semibold max-w-6xl mx-auto text-center mt-6 relative z-10"
			>
				<Balancer>Elevate product development with Squared</Balancer>
			</motion.h1>
			<motion.p
				initial={{
					y: 40,
					opacity: 0,
				}}
				animate={{
					y: 0,
					opacity: 1,
				}}
				transition={{
					ease: "easeOut",
					duration: 0.5,
					delay: 0.2,
				}}
				className="text-center mt-6 text-base md:text-xl text-muted dark:text-muted-dark max-w-3xl mx-auto relative z-10"
			>
				<Balancer>
					Squared the the new way to develop software. Create new tasks, plan
					product goals, and setup milestones using Squared.
				</Balancer>
			</motion.p>
			<motion.div
				initial={{
					y: 80,
					opacity: 0,
				}}
				animate={{
					y: 0,
					opacity: 1,
				}}
				transition={{
					ease: "easeOut",
					duration: 0.5,
					delay: 0.4,
				}}
				className="flex items-center gap-4 justify-center mt-6 relative z-10"
			>
				<Button as={Link} href="https://app.squaredmade.com/register">Get started</Button>
				<Button
					variant="simple"
					as={Link}
					href="/contact"
					className="flex space-x-2 items-center group"
				>
					<span>Contact us</span>
					<HiArrowRight className="text-muted group-hover:translate-x-1 stroke-[1px] h-3 w-3 transition-transform duration-200 dark:text-muted-dark" />
				</Button>
			</motion.div>
			<div className="p-4 border border-neutral-200 bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 rounded-[32px] mt-20 relative">
				<div className="absolute inset-x-0 bottom-0 h-40 w-full bg-gradient-to-b from-transparent via-white to-white dark:via-black/50 dark:to-black scale-[1.1] pointer-events-none" />
				<div className="p-2 bg-white dark:bg-black dark:border-neutral-700 border border-neutral-200 rounded-[24px]">
					{/* todo change image based on dark or light theme */}
					{theme === "light" ? (
						<Image
							src="/squared-grid-light.png"
							alt="header"
							width={1920}
							height={1080}
							className="rounded-[20px]"
						/>
					) : (
						<Image
							src="/squared-grid-dark.png"
							alt="header"
							width={1920}
							height={1080}
							className="rounded-[20px]"
						/>
					)}
				</div>
			</div>
		</div>
	);
};
