"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import type React from "react";
import { BlurImage } from "../blur-image";

export const SkeletonOne = () => {
	return (
		<div className="relative flex p-8 gap-10 h-full">
			<div className=" w-full md:w-[90%] p-5  mx-auto bg-white dark:bg-neutral-900 shadow-2xl group h-full">
				<div className="flex flex-1 w-full h-full flex-col space-y-2 opacity-20 dark:opacity-60 ">
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
			<div className="flex flex-col gap-4 absolute inset-0">
				<div className="p-2 border border-neutral-200 bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 rounded-[32px]  r h-[250px] w-[250px] md:h-[300px] md:w-[300px] mx-auto  flex-shrink-0  z-20 group-hover:scale-[1.02] transition duration-200">
					<div className="p-2 bg-white dark:bg-black dark:border-neutral-700 border border-neutral-200 rounded-[24px] flex-shrink-0">
						{/* todo change based on light or dark */}
						<BlurImage
							src="/track-changes/track-changes-1-dark.png"
							alt="header"
							width={800}
							height={800}
							className="rounded-[20px] w-full h-full object-cover object-bottom aspect-square flex-shrink-0 grayscale"
						/>
					</div>
				</div>
				<div className="p-2 border border-neutral-200 bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 rounded-[32px]  r h-[250px] w-[250px] md:h-[300px] md:w-[300px] mx-auto  flex-shrink-0  z-20 group-hover:scale-[1.02] transition duration-200">
					<div className="p-2 bg-white dark:bg-black dark:border-neutral-700 border border-neutral-200 rounded-[24px] flex-shrink-0">
						<BlurImage
							src="/track-changes/track-changes-2-dark.png"
							alt="header"
							width={800}
							height={800}
							className="rounded-[20px] w-full h-full object-cover object-bottom aspect-square flex-shrink-0 grayscale"
						/>
					</div>
				</div>
			</div>
			{/* Divs are disabled because they don't look good in dark mode.  */}
			<div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-background via-white dark:via-background to-transparent w-full pointer-events-none" />
			<div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-background via-transparent to-transparent w-full pointer-events-none" />
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
			className="flex flex-row rounded-2xl  p-2  items-start space-x-2 bg-white dark:bg-neutral-900"
		>
			<Image
				src="/avatar.jpeg"
				alt="avatar"
				height="100"
				width="100"
				className="rounded-full h-4 w-4 md:h-10 md:w-10"
			/>
			<p className="text-[10px] sm:text-sm text-neutral-500">{children}</p>
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
			className="flex flex-row rounded-2xl   p-2 items-center justify-start space-x-2  bg-white dark:bg-neutral-900 "
		>
			<div className="h-4 w-4 md:h-10 md:w-10 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
			<p className="text-[10px] sm:text-sm text-neutral-500">{children}</p>
		</motion.div>
	);
};
