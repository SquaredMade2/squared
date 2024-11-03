import type { RenderLeafProps } from "slate-react";

const CodeLeaf = (props: RenderLeafProps) => {
	return (
		<span {...props.attributes}>
			<code>{props.children}</code>
		</span>
	);
};

export default CodeLeaf;
