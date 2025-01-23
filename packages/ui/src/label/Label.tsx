import {
	type ComponentPropsWithoutRef,
	type ElementRef,
	forwardRef,
} from "react";
import { Primitive } from "../react-primitive";

/* -------------------------------------------------------------------------------------------------
 * Label
 * -----------------------------------------------------------------------------------------------*/

const NAME = "Label";

type LabelElement = ElementRef<typeof Primitive.label>;
type PrimitiveLabelProps = ComponentPropsWithoutRef<typeof Primitive.label>;
interface LabelProps extends PrimitiveLabelProps {}

const Label = forwardRef<LabelElement, LabelProps>((props, forwardedRef) => {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
		<Primitive.label
			{...props}
			ref={forwardedRef}
			onMouseDown={(event) => {
				// only prevent text selection if clicking inside the label itself
				const target = event.target as HTMLElement;
				if (target.closest("button, input, select, textarea")) return;

				props.onMouseDown?.(event);
				// prevent text selection when double clicking label
				if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
			}}
		/>
	);
});

Label.displayName = NAME;

/* -----------------------------------------------------------------------------------------------*/

const Root = Label;

export {
	Label,
	//
	Root,
};
export type { LabelProps };
