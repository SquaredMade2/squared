import type { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import type { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `ImageSlice`.
 */
export type ImageSliceProps = SliceComponentProps<Content.ImageSliceSlice>;

/**
 * Component for "ImageSlice" Slices.
 */
const ImageSlice: React.FC<ImageSliceProps> = ({ slice }) => {
	const { image, caption } = slice.primary;

	return (
		<figure className="my-8">
			<PrismicNextImage
				field={image}
				className="h-auto w-full rounded-lg shadow-md"
			/>
			{caption && (
				<figcaption className="mt-2 text-center text-muted-foreground text-sm">
					{caption}
				</figcaption>
			)}
		</figure>
	);
};

export default ImageSlice;
