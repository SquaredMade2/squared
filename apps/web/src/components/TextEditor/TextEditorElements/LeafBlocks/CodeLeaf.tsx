import type { RenderLeafProps } from "slate-react";

const CodeLeaf = (props: RenderLeafProps) => {
	return (
		<span {...props.attributes}>
			<code className="text-red-200 bg-gray-800 p-1 rounded-md">
				{props.children}
			</code>
		</span>
	);
};

export default CodeLeaf;
