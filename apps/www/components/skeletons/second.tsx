"use client";
import { stagger, useAnimate } from "framer-motion";
import type React from "react";
import { useState } from "react";

export const SkeletonTwo = () => {
	const [scope, animate] = useAnimate();
	const [animating, setAnimating] = useState(false);

	const handleAnimation = async () => {
		if (animating) return;

		setAnimating(true);
		await animate(
			".message",
			{
				opacity: [0, 1],
				y: [20, 0],
			},
			{
				delay: stagger(0.5),
			},
		);
		setAnimating(false);
	};
	return (
		<div className="relative h-full w-full mt-4">
			<div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white via-white dark:from-black dark:via-black to-transparent w-full pointer-events-none" />
			<div className="p-4 border border-neutral-200 bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 rounded-[32px] h-full z-20">
				<div className="p-2 bg-white dark:bg-black dark:border-neutral-700 border border-neutral-200 rounded-[24px] h-full">
					<div className="w-20 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 mx-auto h-6" />
					<div
						onMouseEnter={handleAnimation}
						ref={scope}
						className="content mt-4 w-[90%] mx-auto"
					>
						<UserMessage>
							David changed the status of TES-Add-More-Color-Themes to Done
						</UserMessage>
						<AIMessage>Reddy created task TES-Design-Projects-Page</AIMessage>
						<UserMessage>
							Reddy sent you a comment in TES-Design-Projects-Page
						</UserMessage>
						<AIMessage>
							Jacob changed the due date of TES-Integrate-Git-Lab to March 12,
							2024
						</AIMessage>
						<UserMessage>
							Omar requests your approval for task TES-Create-Task-Menu
						</UserMessage>
						{/* <AIMessage>I&apos; batman.</AIMessage>
						<AIMessage>
							Now Playing <br />{" "}
							<span className="italic">Something in the way - Nirvana</span>
						</AIMessage> */}
					</div>
				</div>
			</div>
		</div>
	);
};

const UserMessage = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="message bg-neutral-100 dark:bg-neutral-800 dark:text-white text-black p-2 sm:p-4 text-[10px] sm:text-xs my-4 rounded-md">
			{children}
		</div>
	);
};
const AIMessage = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="message bg-black text-white dark:bg-white dark:text-black p-2 sm:p-4 text-[10px] sm:text-xs my-4 rounded-md">
			{children}
		</div>
	);
};
