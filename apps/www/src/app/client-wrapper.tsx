"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "@/context/theme-provider";

export const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			disableTransitionOnChange
			enableSystem
		>
			{children}
		</ThemeProvider>
	);
};
