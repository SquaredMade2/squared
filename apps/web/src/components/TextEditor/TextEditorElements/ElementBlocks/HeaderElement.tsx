import type { RenderElementProps } from "slate-react";

const HeaderElement = (props: RenderElementProps) => {
	return <header className="text-2xl">{props.children}</header>;
};

export default HeaderElement;
