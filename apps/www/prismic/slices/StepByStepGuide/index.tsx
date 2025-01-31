import type { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import type { FC } from "react";

/**
 * Props for `StepByStepGuide`.
 */
export type StepByStepGuideProps =
	SliceComponentProps<Content.StepByStepGuideSlice>;

/**
 * Component for "StepByStepGuide" Slices.
 */
const StepByStepGuide: FC<StepByStepGuideProps> = ({ slice }) => {
	return (
		<div className="my-8">
			<h3 className="mb-4 font-bold text-2xl">{slice.primary.guide_title}</h3>
			<ol className="list-inside list-decimal space-y-6">
				{slice.primary.steps.map((item, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: This is okay because the index is stable.
					<li key={index} className="ml-6">
						<div className="inline-block">
							<PrismicRichText field={item.step} />
						</div>
						{item.step_image.url && (
							<PrismicNextImage
								field={item.step_image}
								className="mt-2 rounded-lg"
							/>
						)}
					</li>
				))}
			</ol>
		</div>
	);
};

export default StepByStepGuide;
