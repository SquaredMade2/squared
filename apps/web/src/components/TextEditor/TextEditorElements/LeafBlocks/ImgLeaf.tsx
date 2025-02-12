import type { RenderLeafProps } from "slate-react";

const ImgLeaf = (props: RenderLeafProps) => {
	return (
		<span {...props.attributes}>
			<img src={props.text.text} />
		</span>
	);
};

export default ImgLeaf;
