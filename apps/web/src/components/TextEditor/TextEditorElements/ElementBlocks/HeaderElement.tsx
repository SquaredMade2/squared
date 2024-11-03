import type { RenderElementProps } from "slate-react";

const HeaderElement = (props: RenderElementProps) => {
	return <h3>{props.children}</h3>;
};

export default HeaderElement;
