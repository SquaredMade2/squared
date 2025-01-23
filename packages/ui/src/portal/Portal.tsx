import ReactDOM from "react-dom";

import {
	type ComponentPropsWithoutRef,
	type ElementRef,
	forwardRef,
	useState,
} from "react";
import { Primitive } from "../react-primitive";
import { useLayoutEffect } from "../use-layout-effect";

/* -------------------------------------------------------------------------------------------------
 * Portal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = "Portal";

type PortalElement = ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = ComponentPropsWithoutRef<typeof Primitive.div>;
interface PortalProps extends PrimitiveDivProps {
	/**
	 * An optional container where the portaled content should be appended.
	 */
	container?: Element | DocumentFragment | null;
}

const Portal = forwardRef<PortalElement, PortalProps>((props, forwardedRef) => {
	const { container: containerProp, ...portalProps } = props;
	const [mounted, setMounted] = useState(false);
	useLayoutEffect(() => setMounted(true), []);
	const container = containerProp || (mounted && globalThis?.document?.body);
	return container
		? ReactDOM.createPortal(
				<Primitive.div {...portalProps} ref={forwardedRef} />,
				container,
			)
		: null;
});

Portal.displayName = PORTAL_NAME;

/* -----------------------------------------------------------------------------------------------*/

const Root = Portal;

export {
	Portal,
	//
	Root,
};
export type { PortalProps };
