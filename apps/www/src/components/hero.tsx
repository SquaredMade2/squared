"use client";

import type { KeyTextField } from "@prismicio/client";
import { ArrowRight } from "@squaredmade/icons";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Link } from "next-view-transitions";
import { useEffect, useState } from "react";
import Balancer from "react-wrap-balancer";
import { config } from "@/config";
import { Badge } from "./badge";
import { Button } from "./button";

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
				animate={{
					opacity: 1,
					y: 0,
				}}
				className="flex justify-center"
				initial={{
					opacity: 0,
					y: 40,
				}}
				transition={{
					duration: 0.5,
					ease: "easeOut",
				}}
			>
				<Badge
					onClick={() => router.push(`${config.NEXT_PUBLIC_APP_URL}/sign-in`)}
				>
					{cta}
				</Badge>
			</motion.div>
			<motion.h1
				animate={{
					opacity: 1,
					y: 0,
				}}
				className="relative z-10 mx-auto mt-6 max-w-6xl text-center font-semibold text-2xl md:text-4xl lg:text-8xl"
				initial={{
					opacity: 0,
					y: 40,
				}}
				transition={{
					duration: 0.5,
					ease: "easeOut",
				}}
			>
				<Balancer>{title}</Balancer>
			</motion.h1>
			<motion.p
				animate={{
					opacity: 1,
					y: 0,
				}}
				className="relative z-10 mx-auto mt-6 max-w-3xl text-center text-base text-foreground md:text-xl"
				initial={{
					opacity: 0,
					y: 40,
				}}
				transition={{
					delay: 0.2,
					duration: 0.5,
					ease: "easeOut",
				}}
			>
				<Balancer>{description}</Balancer>
			</motion.p>
			<motion.div
				animate={{
					opacity: 1,
					y: 0,
				}}
				className="relative z-10 mt-6 flex items-center justify-center gap-4"
				initial={{
					opacity: 0,
					y: 80,
				}}
				transition={{
					delay: 0.4,
					duration: 0.5,
					ease: "easeOut",
				}}
			>
				<Button as={Link} href={`${config.NEXT_PUBLIC_APP_URL}/sign-up`}>
					Get started
				</Button>
				<Button
					as={Link}
					className="group flex items-center space-x-2 font-semibold"
					href="/contact"
					variant="simple"
				>
					<span>Contact us</span>
					<ArrowRight className="h-3 w-3 stroke-[1px] text-foreground transition-transform duration-200 group-hover:translate-x-1 dark:text-muted-dark" />
				</Button>
			</motion.div>
			<div className="relative mt-20 rounded-[32px] border border-neutral-accent bg-neutral-secondary p-4 dark:border-neutral-accent dark:bg-neutral-secondary">
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full scale-[1.1] bg-linear-to-b from-transparent via-white to-white dark:via-background dark:to-background" />
				<div className="rounded-[24px] border border-neutral-accent bg-white p-2 dark:border-neutral-accent dark:bg-black">
					{mounted && (
						<Image
							alt="header"
							className="rounded-[20px]"
							height={1644}
							src={
								resolvedTheme === "dark"
									? "/squared-grid-dark.png"
									: "/squared-grid-light.png"
							}
							width={3022}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
