// import { handleFormatLink } from "@/utils/formatting";
import type { RenderLeafProps } from "slate-react";

const Leaf = (props: RenderLeafProps) => {
	const renderLeafType = () => {
		if (props.leaf.link) {
			// const text = props.text.text || props.children?.toString() || "";
			// const formattedLink = handleFormatLink(text);
			// if (typeof formattedLink === "string") {
			// 	return <span {...props.attributes}>{props.children}</span>;
			// }
			return (
				<span {...props.attributes}>
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
