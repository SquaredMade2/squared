import  type { Content } from "@prismicio/client";
import  {type SliceComponentProps, PrismicRichText } from "@prismicio/react";

/**
 * Props for `Header`.
 */
export type HeaderProps = SliceComponentProps<Content.HeaderSlice>;

/**
 * Component for "Header" Slices.
 */
const Header = ({ slice }: HeaderProps) => {

  console.log("i got to header here: ", slice.primary)
  // console.log("HERE IS THE TITLE: ", slice.primary.title[0]?.text)
  
  return (
    <>
      <PrismicRichText field={slice.primary.title}/>
      <PrismicRichText field={slice.primary.text} />
      <hr className="my-4 border-t border-gray-300" />
    </>
  );
};

export default Header;
