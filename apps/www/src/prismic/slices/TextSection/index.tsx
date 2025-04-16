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
		<div className="prose my-8 max-w-none text-muted-foreground">
			<PrismicRichText
				field={slice.primary.content}
				components={{
					heading1: ({ children }) => (
						<h1 className="font-bold text-4xl text-foreground">{children}</h1>
					),
					heading2: ({ children }) => (
						<h1 className="font-semibold text-3xl text-foreground">
							{children}
						</h1>
					),
					heading3: ({ children }) => (
						<h1 className="font-semibold text-2xl text-foreground">
							{children}
						</h1>
					),
					heading4: ({ children }) => (
						<h1 className="font-semibold text-foreground text-xl">
							{children}
						</h1>
					),
					strong: ({ children }) => (
						<strong className="font-semibold text-foreground">
							{children}
						</strong>
					),
				}}
			/>
		</div>
	);
};

export default TextSection;
