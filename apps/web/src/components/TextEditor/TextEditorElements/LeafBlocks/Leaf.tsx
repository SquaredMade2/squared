import type { RenderLeafProps } from "slate-react";
import CodeLeaf from "./CodeLeaf";
import MentionLeaf from "./MentionLeaf";

const Leaf = (props: RenderLeafProps) => {
	const leafStyling = {
		fontWeight: props.leaf.bold ? "bold" : "normal",
		fontStyle: props.leaf.italic ? "italic" : "",
		textDecoration: props.leaf.underline ? "underline" : "",
	};

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

		if (props.leaf.mentionConfirm) {
			return <MentionLeaf {...props} />;
		}

		return (
			<span
				{...props.attributes}
				style={leafStyling}
				className={`${(props.leaf.mentionConfirm || props.leaf.taskConfirm) && "bg-muted-foreground"} ${Object.values(leafStyling)}`}
			>
				{props.children}
			</span>
		);
	};

	return renderLeafType();
};

export default Leaf;
