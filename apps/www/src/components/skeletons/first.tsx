"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import type React from "react";
import { BlurImage } from "../blur-image";

export const SkeletonOne = () => {
	return (
		<div className="relative flex h-full gap-10 p-8">
			<div className=" group mx-auto h-full w-full bg-background p-5 shadow-2xl md:w-[90%] dark:bg-dark">
				<div className="flex h-full w-full flex-1 flex-col space-y-2 opacity-20 dark:opacity-60 ">
					<UserMessage>
						I&apos;m having a meeting with the design team to create a more
						responsive design.
					</UserMessage>
					<AIMessage>
						Ok. Can you please let them know about the changes to the font?
					</AIMessage>
					<UserMessage>
						Yeah, sure. I think they have a few in mind already.
					</UserMessage>
					<AIMessage>OK! Sounds good. </AIMessage>
					{/* <UserMessage>
						Yes, I&apos;m sure. But if you&apos;re generating that scene, make
						sure the fighters have clown shoes and rubber chickens instead of
						fists!
					</UserMessage>
					<AIMessage>Affirmative, here&apos;s your image.</AIMessage> */}
				</div>
			</div>
			<div className="absolute inset-0 flex flex-col gap-4">
				<div className="r z-20 mx-auto h-[250px] w-[250px] shrink-0 rounded-[32px] border border-light-accent bg-light-secondary p-2 transition duration-200 group-hover:scale-[1.02] md:h-[300px] md:w-[300px] dark:border-dark-accent dark:bg-dark-secondary">
					<div className="shrink-0 rounded-[24px] border border-light-accent bg-background p-2 dark:border-dark-accent dark:bg-black">
						{/* todo change based on light or dark */}
						<BlurImage
							src="/track-changes/track-changes-1-dark.png"
							alt="header"
							width={800}
							height={800}
							className="aspect-square h-full w-full shrink-0 rounded-[20px] object-cover object-bottom grayscale"
						/>
					</div>
				</div>
				<div className="r z-20 mx-auto h-[250px] w-[250px] shrink-0 rounded-[32px] border border-light-accent bg-light-secondary p-2 transition duration-200 group-hover:scale-[1.02] md:h-[300px] md:w-[300px] dark:border-dark-accent dark:bg-dark-secondary">
					<div className="shrink-0 rounded-[24px] border border-light-accent bg-background p-2 dark:border-dark-accent dark:bg-black">
						<BlurImage
							src="/track-changes/track-changes-2-dark.png"
							alt="header"
							width={800}
							height={800}
							className="aspect-square h-full w-full shrink-0 rounded-[20px] object-cover object-bottom grayscale"
						/>
					</div>
				</div>
			</div>
			{/* Divs are disabled because they don't look good in dark mode.  */}
			<div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-60 w-full bg-linear-to-t from-background via-background to-transparent" />
			<div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-60 w-full bg-linear-to-b from-background via-transparent to-transparent" />
		</div>
	);
};

const UserMessage = ({ children }: { children: React.ReactNode }) => {
	const variants = {
		initial: {
			x: 0,
		},
		animate: {
			x: 5,
			transition: {
				duration: 0.2,
			},
		},
	};
	return (
		<motion.div
			variants={variants}
			className="flex flex-row items-start space-x-2 rounded-2xl bg-background p-2 dark:bg-dark"
		>
			<Image
				src="/avatar.jpeg"
				alt="avatar"
				height="100"
				width="100"
				className="h-4 w-4 rounded-full md:h-10 md:w-10"
			/>
			<p className="text-[10px] text-muted-foreground sm:text-sm">{children}</p>
		</motion.div>
	);
};

const AIMessage = ({ children }: { children: React.ReactNode }) => {
	const variantsSecond = {
		initial: {
			x: 0,
		},
		animate: {
			x: 10,
			transition: {
				duration: 0.2,
			},
		},
	};
	return (
		<motion.div
			variants={variantsSecond}
			className="flex flex-row items-center justify-start space-x-2 rounded-2xl bg-background p-2 dark:bg-neutral"
		>
			<div className="h-4 w-4 shrink-0 rounded-full bg-linear-to-r from-pink to-violet md:h-10 md:w-10" />
			<p className="text-[10px] text-muted-foreground sm:text-sm">{children}</p>
		</motion.div>
	);
};
