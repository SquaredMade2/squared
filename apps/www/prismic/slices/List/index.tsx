import type { Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import type { FC } from "react";

/**
 * Props for `List`.
 */
export type ListProps = SliceComponentProps<Content.ListSlice>;

/**
 * Component for "List" Slices.
 */
const List: FC<ListProps> = ({ slice }) => {
	return (
		<div className="p-4">
			<PrismicRichText
				field={slice.primary.text}
				components={{
					list: ({ children }) => {
						if (slice.variation === "number")
							return (
								<ol className="list-decimal font-bold space-y-2 [&>a]:text-link">
									{children}
								</ol>
							);
						return (
							<ul className="list-disc font-bold space-y-2 [&>a]:text-link">
								{children}
							</ul>
						);
					},
				}}
			/>
		</div>
	);
};

export default List;
