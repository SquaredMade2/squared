import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Paragraph`.
 */
export type ParagraphProps = SliceComponentProps<Content.ParagraphSlice>;

/**
 * Component for "Paragraph" Slices.
 */
const Paragraph = ({ slice }: ParagraphProps) => {
	return (
		<p className="pt-2 text-muted-foreground [&>a]:text-blue-600 [&>a]:dark:text-blue-400">
			{slice.primary.text}
		</p>
	);
};

export default Paragraph;
