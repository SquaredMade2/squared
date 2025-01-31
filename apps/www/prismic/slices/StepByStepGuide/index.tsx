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
		<div className="my-12 rounded-lg bg-secondary/30 p-8">
			<h2 className="mb-8 text-center font-bold text-3xl text-foreground">
				{slice.primary.guide_title}
			</h2>
			<ol className="relative border-border border-l">
				{slice.primary.steps.map((step, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: This is a static list
					<li key={index} className="mb-10 ml-6">
						<span className="-left-4 absolute flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-4 ring-background">
							<span className="font-semibold text-primary">{index + 1}</span>
						</span>
						<h3 className="mb-2 flex items-center font-semibold text-foreground text-lg">
							{step.step_title}
						</h3>
						<div className="mb-4 font-normal text-base text-muted-foreground">
							<PrismicRichText field={step.step_description} />
						</div>
						{step.step_image.url && (
							<div className="mb-4">
								<PrismicNextImage
									field={step.step_image}
									className="rounded-lg shadow-md"
									width={600}
									height={400}
									imgixParams={{ fit: "crop" }}
								/>
							</div>
						)}
					</li>
				))}
			</ol>
		</div>
	);
};

export default StepByStepGuide;
