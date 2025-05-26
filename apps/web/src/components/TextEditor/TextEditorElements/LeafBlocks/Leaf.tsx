import { cn } from "@squaredmade/ui/cn";
import type { RenderLeafProps } from "slate-react";
import CodeLeaf from "./CodeLeaf";
import MentionLeaf from "./MentionLeaf";

const Leaf = (props: RenderLeafProps) => {
	const { leaf, attributes, children } = props;
	const leafStyling = {
		fontWeight: leaf.bold ? "bold" : "normal",
		fontStyle: leaf.italic ? "italic" : "",
		borderRadius: leaf.mentionConfirm ? "4px" : "",
		paddingTop: leaf.mentionConfirm ? "2px" : "",
		paddingBottom: leaf.mentionConfirm ? "2px" : "",
	};
	const renderLeafType = () => {
		if (leaf.url) {
			return (
				<a
					{...attributes}
					href={leaf.url}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={`Link to ${leaf.url}`}
				>
					{children}
				</a>
			);
		}
		if (leaf.code) {
			return <CodeLeaf {...props} />;
		}
		if (leaf.mentionConfirm) {
			return <MentionLeaf {...props} />;
		}
		return (
			<span
				{...attributes}
				style={leafStyling}
				className={cn(
					(leaf.mentionConfirm || leaf.taskConfirm) && "bg-muted-foreground",
					leaf.bold && "font-bold",
					leaf.italic && "italic",
					leaf.underline && "underline",
				)}
			>
				{props.children}
			</span>
		);
	};
	return renderLeafType();
};

export default Leaf;
