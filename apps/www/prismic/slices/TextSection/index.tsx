import type { Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import type { FC } from "react";

/**
 * Props for `TextSection`.
 */
export type TextSectionProps = SliceComponentProps<Content.TextSectionSlice>;

/**
 * Component for "TextSection" Slices.
 */
const TextSection: FC<TextSectionProps> = ({ slice }) => {
	return (
		<div className="prose my-8 max-w-none">
			<PrismicRichText field={slice.primary.content} />
		</div>
	);
};

export default TextSection;
