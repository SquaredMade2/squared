"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function SingleLink({
	slug,
	text,
}: { slug: string; text: string; }) {
	const params: {uid: string} | null = useParams();

	return (
		<Link
			href={`/docs/${slug}`}
			className={cn(
				"flex w-full py-3",
				params?.uid === slug &&
					"font-medium text-blue-600 dark:text-blue-400",
			)}
		>
			{text || ""}
		</Link>
	);
}
