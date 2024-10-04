import type { RenderElementProps } from "slate-react";

const CodeElement = (props: RenderElementProps) => {
	return (
		<pre {...props.attributes}>
			<code className="text-red-200 bg-gray-800 p-1 rounded-md">
				{props.children}
			</code>
		</pre>
	);
};

export default CodeElement;
