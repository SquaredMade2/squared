import type React from "react";

export const Badge: React.FC<
	{ children: React.ReactNode } & React.ComponentPropsWithoutRef<"button">
> = ({ children, ...props }) => {
	return (
		<button
			{...props}
			className="group relative mx-auto inline-block w-fit cursor-pointer rounded-full bg-neutral p-px font-semibold text-[10px] text-neutral-inverted-accent leading-6 no-underline shadow-secondary-foreground sm:text-xs md:shadow-2xl dark:bg-neutral-accent dark:shadow-background"
		>
			<span className="absolute inset-0 overflow-hidden rounded-full">
				<span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
			</span>
			<div className="relative z-10 flex items-center space-x-2 rounded-full bg-neutral-secondary px-4 py-1.5 ring-1 ring-white/10 dark:bg-background-dark-accent">
				<span>{children}</span>
				<svg
					fill="none"
					height="16"
					viewBox="0 0 24 24"
					width="16"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Right Chevron</title>
					<path
						d="M10.75 8.75L14.25 12L10.75 15.25"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="1.5"
					/>
				</svg>
			</div>
			<span className="-bottom-0 absolute left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-linear-to-r from-muted/0 via-muted/90 to-muted/0 transition-opacity duration-500 group-hover:opacity-40 dark:from-muted-foreground/0 dark:via-muted-foreground/90 dark:to-muted-foreground/0" />
		</button>
	);
};
