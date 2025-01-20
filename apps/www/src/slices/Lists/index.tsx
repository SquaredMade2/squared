import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `BulletPoints`.
 */
export type BulletPointsProps = SliceComponentProps<Content.BulletPointsSlice>;

/**
 * Component for "BulletPoints" Slices.
 */
const BulletPoints = ({ slice }: BulletPointsProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for bullet_points (variation: {slice.variation})
      Slices
    </section>
  );
};

export default BulletPoints;
