import {
	Children,
	type ComponentProps,
	type HTMLAttributes,
	type ReactElement,
	type ReactNode,
	type Ref,
	cloneElement,
	forwardRef,
	isValidElement,
} from "react";
import { composeRefs } from "../compose-refs";

/* -------------------------------------------------------------------------------------------------
 * Slot
 * -----------------------------------------------------------------------------------------------*/

interface SlotProps extends HTMLAttributes<HTMLElement> {
	children?: ReactNode;
}

const Slot = forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
	const { children, ...slotProps } = props;
	const childrenArray = Children.toArray(children);
	const slottable = childrenArray.find(isSlottable);

	if (slottable) {
		// the new element to render is the one passed as a child of `Slottable`
		const newElement = slottable.props.children;

		const newChildren = childrenArray.map((child) => {
			if (child === slottable) {
				// because the new element will be the one rendered, we are only interested
				// in grabbing its children (`newElement.props.children`)
				if (Children.count(newElement) > 1) return Children.only(null);
				return isValidElement(newElement)
					? (newElement.props as { children: ReactNode }).children
					: null;
			}
			return child;
		});

		return (
			<SlotClone {...slotProps} ref={forwardedRef}>
				{isValidElement(newElement)
					? cloneElement(newElement, undefined, newChildren)
					: null}
			</SlotClone>
		);
	}

	return (
		<SlotClone {...slotProps} ref={forwardedRef}>
			{children}
		</SlotClone>
	);
});

Slot.displayName = "Slot";

/* -------------------------------------------------------------------------------------------------
 * SlotClone
 * -----------------------------------------------------------------------------------------------*/

interface SlotCloneProps {
	children: ReactNode;
}

const SlotClone = forwardRef<any, SlotCloneProps>((props, forwardedRef) => {
	const { children, ...slotProps } = props;

	if (isValidElement(children)) {
		const childrenRef = getElementRef(children);
		return cloneElement(children, {
			...mergeProps(slotProps, children.props as AnyProps),
			// @ts-ignore
			ref: forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef,
		});
	}

	return Children.count(children) > 1 ? Children.only(null) : null;
});

SlotClone.displayName = "SlotClone";

/* -------------------------------------------------------------------------------------------------
 * Slottable
 * -----------------------------------------------------------------------------------------------*/

const Slottable = ({ children }: { children: ReactNode }) => {
	return <>{children}</>;
};

/* ---------------------------------------------------------------------------------------------- */

type AnyProps = Record<string, any>;

function isSlottable(
	child: ReactNode,
): child is ReactElement<ComponentProps<typeof Slottable>, typeof Slottable> {
	return isValidElement(child) && child.type === Slottable;
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
	// all child props should override
	const overrideProps = { ...childProps };

	for (const propName in childProps) {
		const slotPropValue = slotProps[propName];
		const childPropValue = childProps[propName];

		const isHandler = /^on[A-Z]/.test(propName);
		if (isHandler) {
			// if the handler exists on both, we compose them
			if (slotPropValue && childPropValue) {
				overrideProps[propName] = (...args: unknown[]) => {
					childPropValue(...args);
					slotPropValue(...args);
				};
			}
			// but if it exists only on the slot, we use only this one
			else if (slotPropValue) {
				overrideProps[propName] = slotPropValue;
			}
		}
		// if it's `style`, we merge them
		else if (propName === "style") {
			overrideProps[propName] = {
				...slotPropValue,
				...childPropValue,
			};
		} else if (propName === "className") {
			overrideProps[propName] = [slotPropValue, childPropValue]
				.filter(Boolean)
				.join(" ");
		}
	}

	return { ...slotProps, ...overrideProps };
}

// Before React 19 accessing `element.props.ref` will throw a warning and suggest using `element.ref`
// After React 19 accessing `element.ref` does the opposite.
// https://github.com/facebook/react/pull/28348
//
// Access the ref using the method that doesn't yield a warning.
function getElementRef(element: ReactElement) {
	// React <=18 in DEV
	let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
	let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) {
		return (element as any).ref;
	}

	// React 19 in DEV
	getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
	mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) {
		return (element.props as { ref?: Ref<unknown> }).ref;
	}

	// Not DEV
	return (element.props as { ref?: Ref<unknown> }).ref || (element as any).ref;
}

const Root = Slot;

export {
	//
	Root,
	Slot,
	Slottable,
};
export type { SlotProps };
