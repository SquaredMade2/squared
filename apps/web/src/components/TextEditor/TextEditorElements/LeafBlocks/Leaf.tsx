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
			<span
				{...props.attributes}
				style={leafStyling}
				className={`${(props.leaf.mentionConfirm || props.leaf.taskConfirm) && "bg-muted-foreground"}`}
			>
				{props.children}
			</span>
		);
	};

	const leafStyling = {
		fontWeight: props.leaf.bold ? "bold" : "normal",
		fontStyle: props.leaf.italic ? "italic" : "",
		borderRadius: props.leaf.mentionConfirm ? "4px" : "",
		paddingTop: props.leaf.mentionConfirm ? "2px" : "",
		paddingBottom: props.leaf.mentionConfirm ? "2px" : "",
	};
	return renderLeafType();
};

export default Leaf;
