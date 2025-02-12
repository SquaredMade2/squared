import type { RenderLeafProps } from "slate-react";

const ImgLeaf = (props: RenderLeafProps) => {
	console.log(props.text.img);
	return (
		<span {...props.attributes}>
			<img src={props.text.img} />
		</span>
	);
};

export default ImgLeaf;
