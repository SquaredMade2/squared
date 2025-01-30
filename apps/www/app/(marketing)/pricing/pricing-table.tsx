"use client";
import { useId } from "react";

import { tiers } from "@/constants/tier";
import { IconCheck } from "@tabler/icons-react";

export function PricingTable() {
	const CheckIcon = () => {
		return (
			<IconCheck className="mx-auto h-4 w-4 flex-shrink-0 text-black dark:text-white" />
		);
	};

	const tableFeatures = [
		// {
		// 	title: "Create APIs",
		// 	hobby: <CheckIcon />,
		// 	starter: <CheckIcon />,
		// 	professional: <CheckIcon />,
		// 	enterprise: <CheckIcon />,
		// },
		{
			title: "Access to Dashboard",
			hobby: <CheckIcon />,
			starter: <CheckIcon />,
			professional: <CheckIcon />,
			enterprise: <CheckIcon />,
		},
		{
			title: "Share functionality",
			hobby: <CheckIcon />,
			starter: <CheckIcon />,
			professional: <CheckIcon />,
			enterprise: <CheckIcon />,
		},
		// {
		//   title: "Playground Editor",
		//   hobby: <CheckIcon />,
		//   starter: <CheckIcon />,
		//   professional: <CheckIcon />,
		//   enterprise: <CheckIcon />,
		// },
		{
			title: "Marketplace access",
			hobby: <CheckIcon />,
			starter: <CheckIcon />,
			professional: <CheckIcon />,
			enterprise: <CheckIcon />,
		},
		{
			title: "On call support",
			hobby: <CheckIcon />,
			starter: <CheckIcon />,
			professional: <CheckIcon />,
			enterprise: <CheckIcon />,
		},
		{
			title: "Developer Program",
			starter: <CheckIcon />,
			hobby: <CheckIcon />,
			professional: <CheckIcon />,
			enterprise: <CheckIcon />,
		},

		// {
		// 	title: "Long running APIs",
		// 	hobby: "Probably never",
		// 	starter: "Nuh uh",
		// 	professional: <CheckIcon />,
		// 	enterprise: <CheckIcon />,
		// },
		{
			title: "Zero Downtime Guarantee",
			hobby: "",
			starter: "",
			professional: <CheckIcon />,
			enterprise: <CheckIcon />,
		},
		{
			title: "Custom Analytics",
			hobby: "",
			starter: "",
			professional: <CheckIcon />,
			enterprise: <CheckIcon />,
		},
		{
			title: "Advanced Analytics",
			hobby: "",
			starter: "",
			professional: <CheckIcon />,
			enterprise: <CheckIcon />,
		},
		{
			title: "Single Sign On",
			hobby: "",
			starter: "",
			professional: "",
			enterprise: <CheckIcon />,
		},
		{
			title: "Security certificate",
			hobby: "",
			starter: "",
			professional: "",
			enterprise: <CheckIcon />,
		},
		{
			title: "Retweets from us",
			hobby: "",
			starter: "",
			professional: "",
			enterprise: <CheckIcon />,
		},
		{
			title: "We send you flowers",
			hobby: "",
			starter: "",
			professional: "",
			enterprise: <CheckIcon />,
		},
	];

	return (
		<div className="relative z-20 mx-auto w-full px-4 py-40">
			<div className="mt-8 flow-root">
				<div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8 overflow-x-auto">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						<table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
							<thead className="">
								<tr>
									<th
										scope="col"
										className="max-w-xs py-3.5 pr-3 pl-4 text-left font-extrabold text-3xl text-neutral-900 sm:pl-0 dark:text-white"
									/>
									{tiers?.map((item) => (
										<th
											scope="col"
											className="px-3 py-3.5 text-center font-semibold text-lg text-neutral-900 dark:text-white"
											key={`pricing-${useId()}`}
										>
											{item.name}
										</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
								{tableFeatures.map((feature) => (
									<tr key={feature.title}>
										<td className="whitespace-nowrap py-4 pr-3 pl-4 font-medium text-neutral-900 text-sm sm:pl-0 dark:text-white">
											{feature.title}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-center text-muted text-sm dark:text-muted-dark">
											{feature.hobby}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-center text-muted text-sm dark:text-muted-dark">
											{feature.starter}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-center text-muted text-sm dark:text-muted-dark">
											{feature.professional}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-center text-muted text-sm dark:text-muted-dark">
											{feature.enterprise}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				{/* <FreeTrial /> */}
			</div>
		</div>
	);
}
