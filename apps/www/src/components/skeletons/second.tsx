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
		<div className="relative mt-4 h-full w-full">
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full bg-linear-to-t from-background via-background to-transparent" />
			<div className="z-20 h-full rounded-[32px] border border-neutral-accent bg-neutral-secondary p-4">
				<div className="h-full rounded-[24px] border border-neutral-accent bg-background p-2">
					<div className="mx-auto h-6 w-20 rounded-full bg-neutral-accent/80 dark:bg-neutral-secondary/80" />
					<div
						onMouseEnter={handleAnimation}
						ref={scope}
						className="content mx-auto mt-4 w-[90%]"
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
		<div className="message my-4 rounded-md bg-neutral-secondary p-2 text-[10px] text-foreground sm:p-4 sm:text-xs">
			{children}
		</div>
	);
};
const AIMessage = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="message my-4 rounded-md bg-foreground p-2 text-[10px] text-background sm:p-4 sm:text-xs">
			{children}
		</div>
	);
};
