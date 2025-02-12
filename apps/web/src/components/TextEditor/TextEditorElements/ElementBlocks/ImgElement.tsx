import type { RenderElementProps } from "slate-react";

const ImgElement = (props: RenderElementProps) => {
	return (
		<span {...props.attributes}>
			<img src={props.element.children[0].text} />
		</span>
	);
};
export default ImgElement;
