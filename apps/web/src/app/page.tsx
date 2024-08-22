"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL;

export default function Landingpage() {
	const router = useRouter();

	useEffect(() => {
		router.push(`${NEXT_PUBLIC_URL}/login`);
	}, []);

	return <div className="w-full flex items-center h-[100vh] bg-[#141414]" />;
}
