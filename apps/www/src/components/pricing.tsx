"use client";
import { tiers } from "@/constants/tier";
import { cn } from "@squaredmade/ui/cn";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "./button";

export function Pricing() {
	const [active, setActive] = useState("monthly");
	const tabs = [
		{ name: "Monthly", value: "monthly" },
		{ name: "Yearly", value: "yearly" },
	];

	return (
		<div className="relative">
			<div className="mx-auto mb-12 flex w-fit items-center justify-center overflow-hidden rounded-2xl bg-neutral-100 p-2 dark:bg-background">
				{tabs.map((tab) => (
					<button
						key={tab.value}
						className={cn(
							"relative rounded-xl p-3 font-medium text-gray-500 text-sm dark:text-muted-dark",
							active === tab.value ? " text-white dark:text-black" : "",
						)}
						onClick={() => setActive(tab.value)}
						type="button"
					>
						{active === tab.value && (
							<motion.span
								layoutId="moving-div"
								transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
								className="absolute inset-0 rounded-xl bg-black dark:bg-white"
							/>
						)}
						<span className="relative z-10">{tab.name}</span>
					</button>
				))}
			</div>
			<div className="relative z-20 mx-auto mt-4 grid grid-cols-1 items-center gap-4 md:mt-20 md:grid-cols-2 xl:grid-cols-4">
				{tiers.map((tier) => (
					<div
						key={tier.id}
						className={cn(
							tier.featured
								? "relative bg-[radial-gradient(164.75%_100%_at_50%_0%,#3B82F6_10%,#1E3A8A_48%,#0F172A_100%)] shadow-2xl shadow-blue-900/30"
								: " bg-neutral-100 shadow-2xl dark:bg-[radial-gradient(164.75%_100%_at_50%_0%,#334155_0%,#0F172A_48.73%)]",
							"flex h-full flex-col justify-between rounded-2xl px-6 py-8 sm:mx-8 lg:mx-0",
						)}
					>
						<div className="">
							<h3
								id={tier.id}
								className={cn(
									tier.featured ? "text-white" : "dark:text-muted-dark",
									"font-semibold text-base leading-7",
								)}
							>
								{tier.name}
							</h3>
							<p className="mt-4">
								<motion.span
									initial={{ x: -20, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ duration: 0.2, ease: "easeOut" }}
									key={active}
									className={cn(
										"inline-block font-bold text-4xl tracking-tight",
										tier.featured
											? "text-white"
											: "text-neutral-900 dark:text-neutral-200",
									)}
								>
									{active === "monthly" ? tier.priceMonthly : tier.priceYearly}
								</motion.span>
							</p>
							<p
								className={cn(
									tier.featured
										? "text-neutral-300"
										: "text-neutral-600 dark:text-neutral-300",
									"mt-6 h-12 text-sm leading-7 md:h-12 xl:h-12",
								)}
							>
								{tier.description}
							</p>
							<ul
								className={cn(
									tier.featured
										? "text-neutral-300"
										: "text-neutral-600 dark:text-neutral-300",
									"mt-8 space-y-3 text-sm leading-6 sm:mt-10",
								)}
							>
								{tier.features.map((feature) => (
									<li key={feature} className="flex gap-x-3">
										<IconCircleCheckFilled
											className={cn(
												tier.featured ? "text-white" : "dark:text-muted-dark",
												"h-6 w-5 flex-none",
											)}
											aria-hidden="true"
										/>
										{feature}
									</li>
								))}
							</ul>
						</div>
						<div>
							<Button
								onClick={tier.onClick}
								aria-describedby={tier.id}
								className={cn(
									tier.featured
										? "bg-white text-black shadow-xs hover:bg-white/90 focus-visible:outline-white dark:bg-white"
										: "",
									"mt-8 block w-full rounded-xl px-3.5 py-2.5 text-center font-semibold text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10",
								)}
							>
								{tier.cta}
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
