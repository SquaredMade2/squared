import type { Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

/**
 * Props for `BulletPoints`.
 */
export type BulletPointsProps = SliceComponentProps<Content.BulletPointsSlice>;

/**
 * Component for "BulletPoints" Slices.
 */
const BulletPoints = ({ slice }: BulletPointsProps) => {
	return (
		<div>
			<PrismicRichText
				field={slice.primary.bullet_list}
				components={{
					list: ({ children }) => (
						<ul className="list-disc font-bold p-4 space-y-2 [&>a]:text-blue-600 [&>a]:dark:text-blue-400">
							{children}
						</ul>
					),
				}}
			/>
		</div>
	);
};

export default BulletPoints;
