"use client";

import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
	href: string;
	children: ReactNode;
	active?: boolean;
	className?: string;
	target?: "_blank";
};

export function NavBarItem({
	children,
	href,
	active,
	target,
	className,
}: Props) {
	const pathname = usePathname();

	return (
		<Link
			href={href}
			className={cn(
				"flex items-center justify-center  text-sm leading-[110%] px-4 py-2 rounded-md hover:bg-[#F5F5F5] dark:hover:bg-background-navBarHover text-foreground",
				(active || pathname?.includes(href)) &&
					"bg-gray-100 dark:bg-background-darkSecondary text-foreground",
				className,
			)}
			target={target}
		>
			{children}
		</Link>
	);
}
