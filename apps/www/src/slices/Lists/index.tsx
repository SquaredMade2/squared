import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `BulletPoints`.
 */
export type BulletPointsProps = SliceComponentProps<Content.BulletPointsSlice>;

/**
 * Component for "BulletPoints" Slices.
 */
const BulletPoints = ({ slice }: BulletPointsProps): JSX.Element => {
  return (
    <section>
       {slice.primary.list.map((item, index )=> (
        //  <div key={index}>
        //   {item.text[0].text}
        //  </div>
        <div key={index}>test</div>
       ))}
    </section>
  );
};

export default BulletPoints;
