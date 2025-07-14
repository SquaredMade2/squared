import type { CustomDescendant, CustomElement } from "@/components/TextEditor";

export const isCustomElement = (
	node: CustomDescendant,
): node is CustomElement => {
	return "children" in node;
};
