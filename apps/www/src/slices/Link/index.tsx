import SingleLink from "@/components/docs-link";
import {
	// Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import type { Content } from "@prismicio/client";
import { PrismicLink, type SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Link`.
 */
export type LinkProps = SliceComponentProps<Content.LinkSlice>;

/**
 * Component for "Link" Slices.
 */
// interface LinkValues {
// 	item_label: string;
// 	item_slug_url: string;
// }
// const NestedAccordion = ({
// 	trigger,
// 	links,
// }: { trigger: string; links: LinkValues[] }) => {
// 	return (
// 		<Accordion type="multiple" className="w-full">
// 			<AccordionItem value={trigger}>
// 				<AccordionTrigger className="hover:no-underline py-3">
// 					{trigger}
// 				</AccordionTrigger>
// 				<AccordionContent>
// 					{links.map((item) => (
// 						<SingleLink
// 							key={item.item_slug_url}
// 							text={item.item_label}
// 							slug={item.item_slug_url}
// 						/>
// 					))}
// 				</AccordionContent>
// 			</AccordionItem>
// 		</Accordion>
// 	);
// };

const LinkComponent = ({ slice }: LinkProps) => {
	return (
		<>
			{slice.variation === "default" && (
				<PrismicLink
					field={slice.primary.label}
					externalComponent={() => (
						<SingleLink
							slug={slice.primary.slug || ""}
							text={slice.primary.label.text || ""}
						/>
					)}
				/>
			)}
			{slice.variation === "accordion" && (
				<AccordionItem value={slice.primary.accordion_trigger as string}>
					<AccordionTrigger className="hover:no-underline py-3">
						{slice.primary.accordion_trigger || "Open"}
					</AccordionTrigger>
					<AccordionContent>
						<div className="ml-4">
							{/* {slice.primary.nested_accordion.data && (
								<NestedAccordion
									trigger={
										slice.primary.nested_accordion.data
											.accordion_trigger as string
									}
									links={
										(slice.primary.nested_accordion.data
											.accordion_content as LinkValues) || []
									}
								/>
							)} */}
							{slice.primary.accordion_content.map((item) => (
									<SingleLink
										key={item.item_slug_url}
										text={item.item_label || ""}
										slug={item.item_slug_url || ""}
									/>
								))}
						</div>
					</AccordionContent>
				</AccordionItem>
			)}
		</>
	);
};

export default LinkComponent;
