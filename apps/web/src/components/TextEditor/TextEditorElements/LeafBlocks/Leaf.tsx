import type { RenderLeafProps } from "slate-react";
import CodeLeaf from "./CodeLeaf";

const Leaf = (props: RenderLeafProps) => {
	const renderLeafType = () => {
		if (props.leaf.url) {
			return (
				<a
					{...props.attributes}
					href={props.leaf.url}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={`Link to ${props.leaf.url}`}
				>
					{props.children}
				</a>
			);
		}
		if (props.leaf.code) {
			return <CodeLeaf {...props} />;
		}
		return (
			<span {...props.attributes} style={leafStyling}>
				{props.children}
			</span>
		);
	};

	const leafStyling = {
		fontWeight: props.leaf.bold ? "bold" : "normal",
		fontStyle: props.leaf.italic ? "italic" : "",
		backgroundColor: props.leaf.mentionConfirm ? "gray" : "",
	};
	return renderLeafType();
};

export default Leaf;
