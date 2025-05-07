"use client";

import type { Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@squaredmade/ui/accordion";
import type { FC } from "react";

/**
 * Props for `FaqSection`.
 */
export type FaqSectionProps = SliceComponentProps<Content.FaqSectionSlice>;

/**
 * Component for "FaqSection" Slices.
 */
const FaqSection: FC<FaqSectionProps> = ({ slice }) => {
	return (
		<div className="my-8">
			<h3 className="mb-4 font-bold text-2xl">{slice.primary.section_title}</h3>
			<Accordion type="single" collapsible className="w-full">
				{slice.primary.questions.map((item, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: This is okay because the index is stable.
					<AccordionItem key={index} value={`item-${index}`}>
						<AccordionTrigger>{item.question}</AccordionTrigger>
						<AccordionContent>
							<PrismicRichText field={item.answer} />
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
};

export default FaqSection;
