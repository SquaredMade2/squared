"use client";

import { useInView } from "framer-motion";
import { type JSX, useRef } from "react";

export function InViewDiv({
	children,
	...props
}: { children: React.ReactNode } & JSX.IntrinsicElements["div"]) {
	const containerRef = useRef<HTMLDivElement>(null);
	const isInView = useInView(containerRef, { once: true, amount: 0.4 });

	return (
		<div ref={containerRef} {...props}>
			{isInView ? children : null}
		</div>
	);
}
