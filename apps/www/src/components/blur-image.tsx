"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

interface IBlurImage {
	height?: number;
	width?: number;
	src: string;
	className?: string;
	alt?: string | undefined;
	layout?: string;
	[x: string]: unknown;
}

export const BlurImage = ({
	height,
	width,
	src,
	className,
	alt,
	layout,
	...rest
}: IBlurImage) => {
	const [isLoading, setLoading] = useState(true);
	return (
		<Image
			className={clsx(
				"transform transition duration-300",
				isLoading ? "scale-105 blur-xs" : "scale-100 blur-0",
				className,
			)}
			onLoadingComplete={() => setLoading(false)}
			src={src}
			width={width}
			height={height}
			loading="lazy"
			decoding="async"
			blurDataURL={src}
			layout={layout}
			alt={alt ? alt : "Avatar"}
			{...rest}
		/>
	);
};
