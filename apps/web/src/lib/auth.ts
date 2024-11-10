"use client";

import { signOut } from "next-auth/react";

export const logout = async () => {
	// Sign out using NextAuth and redirect to login page
	await signOut({ redirect: false });

	// Use Next.js router to redirect to login page
	window.location.href = "/login";
};
