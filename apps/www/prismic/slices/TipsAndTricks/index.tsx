import type { Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import { Lightbulb } from "@squared/icons";
import type { FC } from "react";

/**
 * Props for `TipsAndTricks`.
 */
export type TipsAndTricksProps =
	SliceComponentProps<Content.TipsAndTricksSlice>;

/**
 * Component for "TipsAndTricks" Slices.
 */
const TipsAndTricks: FC<TipsAndTricksProps> = ({ slice }) => {
	return (
		<div className="my-8">
			<h3 className="mb-4 font-bold text-2xl">{slice.primary.section_title}</h3>
			<ul className="space-y-4">
				{slice.primary.tip.map((item, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: This is okay because the index is stable.
					<li key={index} className="flex items-start">
						<Lightbulb className="mt-1 mr-2 h-6 w-6 flex-shrink-0 text-yellow-500" />
						<div>
							<PrismicRichText field={item.tip} />
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TipsAndTricks;
