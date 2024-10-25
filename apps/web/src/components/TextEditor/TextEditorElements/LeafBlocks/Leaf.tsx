// import { handleFormatLink } from "@/utils/formatting";
import type { RenderLeafProps } from "slate-react";
import CodeLeaf from "./CodeLeaf";

const Leaf = (props: RenderLeafProps) => {
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
	};
	return renderLeafType();
};

export default Leaf;
