// app/global-error.tsx
"use client";

import * as Sentry from "@sentry/nextjs";
import { Button } from "@squared/ui/button";
import { useEffect } from "react";

export default function GlobalError({
	error,
	reset,
}: { error: Error; reset: () => void }) {
	useEffect(() => {
		// Report the error to Sentry
		Sentry.captureException(error);
	}, [error]);

	return (
		<div className="w-full h-full">
			<h2 className="text-3xl">Something went wrong!</h2>
			<Button
				onClick={() => reset()}
				type="button"
				size="lg"
				variant={"secondary"}
			>
				Try again
			</Button>
		</div>
	);
}
