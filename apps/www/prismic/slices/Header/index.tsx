import type { Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Header`.
 */
export type HeaderProps = SliceComponentProps<Content.HeaderSlice>;

/**
 * Component for "Header" Slices.
 */
const Header = ({ slice }: HeaderProps) => {
	console.log("SLICE HERE", slice.primary.title, slice.primary.text)
	return (
		<div className="w-full pt-5">
			<PrismicRichText
				field={slice.primary.title}
				components={{
					heading1: ({ children }) => (
						<h1 className="text-4xl font-bold my-3">
							{children}
						</h1>
					),
					heading2: ({ children }) => (
						<h2 className="text-3xl font-bold my-3">{children}</h2>
					),
					heading3: ({ children }) => (
						<h3 className="text-2xl font-bold my-3">{children}</h3>
					),
					heading4: ({ children }) => (
						<h4 className="text-xl font-bold my-3">{children}</h4>
					),
				}}
			/>
			<PrismicRichText
			
				field={slice.primary.text}
				components={{
					paragraph: ({ children }) => <p className="text-muted-foreground [&>a]:text-primary">{children}</p>,
				}}
			/>
		</div>
	);
};

export default Header;
