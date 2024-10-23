// import { handleFormatLink } from "@/utils/formatting";
import type { RenderLeafProps } from "slate-react";
import CodeLeaf from "./CodeLeaf";

const Leaf = (props: RenderLeafProps) => {
	const renderCodeLeaf = (language: string) => {
		switch (language) {
			case "javascript":
				// TODO: add new languages here and render something diff depending on it
				return;
			default:
				return <CodeLeaf {...props} />;
		}
	};

	const renderLeafType = () => {
		if (props.leaf.link) {
			return (
				<span {...props.attributes}>
					{/* TODO: implement links */}
					{/* {beforeLink}
					<a
						href={formattedLink.linkUrl}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`Link to ${formattedLink.linkName}`}
					>
						{formattedLink.linkName}
					</a>
					{afterLink} */}
					{props.children}
				</span>
			);
		}
		if (props.leaf.code) {
			return renderCodeLeaf(props.leaf.code);
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
	};
	return renderLeafType();
};

export default Leaf;
