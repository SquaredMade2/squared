"use client";

import { useUserStore } from "@/store";
import { signOut } from "next-auth/react";

export const logout = async () => {
	const setCurrentUser = useUserStore((state) => state.setCurrentUser);
	setCurrentUser(null);

	// Clear all session storage items
	sessionStorage.clear();

	// Sign out using NextAuth and redirect to login page
	await signOut({ redirect: false });

	// Use Next.js router to redirect to login page
	window.location.href = "/login";
};
