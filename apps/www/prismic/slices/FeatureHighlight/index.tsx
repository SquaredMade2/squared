import type { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import type { FC } from "react";

/**
 * Props for `FeatureHighlight`.
 */
export type FeatureHighlightProps =
	SliceComponentProps<Content.FeatureHighlightSlice>;

/**
 * Component for "FeatureHighlight" Slices.
 */
const FeatureHighlight: FC<FeatureHighlightProps> = ({ slice }) => {
	return (
		<div className="my-8 rounded-lg bg-secondary p-6">
			<h3 className="mb-4 font-bold text-2xl">{slice.primary.feature_name}</h3>
			<div className="flex flex-col items-center gap-6 md:flex-row">
				<div className="flex-1">
					<PrismicRichText field={slice.primary.description} />
				</div>
				<div className="flex-1">
					<PrismicNextImage
						field={slice.primary.feature_image}
						className="rounded-lg"
					/>
				</div>
			</div>
		</div>
	);
};

export default FeatureHighlight;
