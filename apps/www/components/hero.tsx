"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { HiArrowRight } from "react-icons/hi2";
import Balancer from "react-wrap-balancer";
import { Badge } from "./badge";
import { Button } from "./button";

import type { KeyTextField } from "@prismicio/client";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface HeroProps {
	title: KeyTextField;
	description: KeyTextField;
	cta: KeyTextField;
}

export const Hero = ({ title, description, cta }: HeroProps) => {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden pt-20 md:pt-40">
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
				<Badge
					onClick={() =>
						router.push(`${process.env.NEXT_PUBLIC_APP_URL}/sign-in`)
					}
				>
					{cta}
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
				className="relative z-10 mx-auto mt-6 max-w-6xl text-center font-semibold text-2xl md:text-4xl lg:text-8xl"
			>
				<Balancer>{title}</Balancer>
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
				className="relative z-10 mx-auto mt-6 max-w-3xl text-center text-base text-foreground md:text-xl"
			>
				<Balancer>{description}</Balancer>
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
				className="relative z-10 mt-6 flex items-center justify-center gap-4"
			>
				<Button as={Link} href={`${process.env.NEXT_PUBLIC_APP_URL}/sign-up`}>
					Get started
				</Button>
				<Button
					variant="simple"
					as={Link}
					href="/contact"
					className="group flex items-center space-x-2 font-semibold"
				>
					<span>Contact us</span>
					<HiArrowRight className="h-3 w-3 stroke-[1px] text-foreground transition-transform duration-200 group-hover:translate-x-1 dark:text-muted-dark" />
				</Button>
			</motion.div>
			<div className="relative mt-20 rounded-[32px] border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-700 dark:bg-neutral-800">
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full scale-[1.1] bg-gradient-to-b from-transparent via-white to-white dark:via-background dark:to-background" />
				<div className="rounded-[24px] border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-black">
					{mounted && (
						<Image
							src={
								resolvedTheme === "dark"
									? "/squared-grid-dark.png"
									: "/squared-grid-light.png"
							}
							alt="header"
							width={3022}
							height={1644}
							className="rounded-[20px]"
						/>
					)}
				</div>
			</div>
		</div>
	);
};
