"use client";

import { cn } from "@squaredmade/ui/cn";
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
				"flex items-center justify-center rounded-md px-4 py-2 text-foreground text-sm leading-[110%] hover:bg-neutral-secondary dark:hover:bg-background-nav-bar-hover",
				(active || pathname?.includes(href)) &&
					"bg-neutral-secondary text-foreground dark:bg-background-dark-secondary",
				className,
			)}
			target={target}
		>
			{children}
		</Link>
	);
}
