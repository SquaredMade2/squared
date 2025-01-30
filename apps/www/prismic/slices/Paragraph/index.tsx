import type { Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Paragraph`.
 */
export type ParagraphProps = SliceComponentProps<Content.ParagraphSlice>;

/**
 * Component for "Paragraph" Slices.
 */
const Paragraph = ({ slice }: ParagraphProps) => {
	return (
		<PrismicRichText
			field={slice.primary.text}
			components={{
				paragraph: ({ children }) => (
					<p className="pt-2 text-muted-foreground [&>a]:text-link">
						{children}
					</p>
				),
			}}
		/>
	);
};

export default Paragraph;
