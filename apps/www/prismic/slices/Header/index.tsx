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
	return (
		<div className="w-full pt-5">
			<PrismicRichText
				field={slice.primary.title}
				components={{
					heading1: ({ children }) => (
						<h1 className="my-3 font-bold text-4xl">
							{children}
						</h1>
					),
					heading2: ({ children }) => (
						<h2 className="my-3 font-bold text-3xl">{children}</h2>
					),
					heading3: ({ children }) => (
						<h3 className="my-3 font-bold text-2xl">{children}</h3>
					),
					heading4: ({ children }) => (
						<h4 className="my-3 font-bold text-xl">{children}</h4>
					),
				}}
			/>
			<PrismicRichText
			
				field={slice.primary.text}
				components={{
					paragraph: ({ children }) => <p className="text-muted-foreground [&>a]:text-link">{children}</p>,
				}}
			/>
		</div>
	);
};

export default Header;
