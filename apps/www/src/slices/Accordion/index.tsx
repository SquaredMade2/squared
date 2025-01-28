import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Accordion`.
 */
export type AccordionProps = SliceComponentProps<Content.AccordionSlice>;

/**
 * Component for "Accordion" Slices.
 */
const Accordion = ({ slice }: AccordionProps) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for accordion (variation: {slice.variation}) Slices
    </section>
  );
};

export default Accordion;
