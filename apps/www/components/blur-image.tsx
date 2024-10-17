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
				"transition duration-300 transform",
				isLoading ? "blur-sm scale-105" : "blur-0 scale-100",
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
