"use client";

import { ThemeProvider } from "@/context/theme-provider";
import { useEffect, useState } from "react";

export const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<ThemeProvider
			attribute="class"
			enableSystem
			disableTransitionOnChange
			defaultTheme="system"
		>
			{children}
		</ThemeProvider>
	);
};
