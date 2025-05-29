import { composeRefs } from "@squaredmade/ui/compose-refs";
import * as React from "react";

/* -------------------------------------------------------------------------------------------------
 * Slot
 * -----------------------------------------------------------------------------------------------*/

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
	children?: React.ReactNode;
}

/**
 * Creates a Slot component with a specific owner name.
 * A Slot component allows for component composition by rendering its children
 * and merging props with them. When a Slottable component is passed as a child,
 * it replaces the standard children with the Slottable's children.
 *
 * @param {string} ownerName - The name to use in the component's displayName
 */
/* @__NO_SIDE_EFFECTS__ */ function createSlot(ownerName: string) {
	const SlotClone = createSlotClone(ownerName);
	const Slot = React.forwardRef<HTMLElement, SlotProps>(
		(props, forwardedRef) => {
			const { children, ...slotProps } = props;
			const childrenArray = React.Children.toArray(children);
			const slottable = childrenArray.find(isSlottable);

			if (slottable) {
				// the new element to render is the one passed as a child of `Slottable`
				const newElement = slottable.props.children;

				const newChildren = childrenArray.map((child) => {
					if (child === slottable) {
						// because the new element will be the one rendered, we are only interested
						// in grabbing its children (`newElement.props.children`)
						if (React.Children.count(newElement) > 1)
							return React.Children.only(null);
						return React.isValidElement(newElement)
							? (newElement.props as { children: React.ReactNode }).children
							: null;
					}
					return child;
				});

				return (
					<SlotClone {...slotProps} ref={forwardedRef}>
						{React.isValidElement(newElement)
							? React.cloneElement(newElement, undefined, newChildren)
							: null}
					</SlotClone>
				);
			}

			return (
				<SlotClone {...slotProps} ref={forwardedRef}>
					{children}
				</SlotClone>
			);
		},
	);

	Slot.displayName = `${ownerName}.Slot`;
	return Slot;
}

const Slot = createSlot("Slot");

/* -------------------------------------------------------------------------------------------------
 * SlotClone
 * -----------------------------------------------------------------------------------------------*/

interface SlotCloneProps {
	children: React.ReactNode;
}

/**
 * Creates a SlotClone component that handles the actual cloning of elements.
 * SlotClone merges props passed to the slot with the props of its child,
 * and composes event handlers and manages refs appropriately.
 *
 * @param {string} ownerName - The name to use in the component's displayName
 */
/* @__NO_SIDE_EFFECTS__ */ function createSlotClone(ownerName: string) {
	const SlotClone = React.forwardRef<HTMLElement, SlotCloneProps>(
		(props, forwardedRef) => {
			const { children, ...slotProps } = props;

			if (React.isValidElement(children)) {
				const childrenRef = getElementRef(children);
				const props = mergeProps(slotProps, children.props as AnyProps);
				// do not pass ref to React.Fragment for React 19 compatibility
				if (children.type !== React.Fragment) {
					props.ref = forwardedRef
						? composeRefs(forwardedRef, childrenRef)
						: childrenRef;
				}
				return React.cloneElement(children, props);
			}

			return React.Children.count(children) > 1
				? React.Children.only(null)
				: null;
		},
	);

	SlotClone.displayName = `${ownerName}.SlotClone`;
	return SlotClone;
}

/* -------------------------------------------------------------------------------------------------
 * Slottable
 * -----------------------------------------------------------------------------------------------*/

const SLOTTABLE_IDENTIFIER = Symbol("squared.slottable");

interface SlottableProps {
	children: React.ReactNode;
}

interface SlottableComponent extends React.FC<SlottableProps> {
	__squaredId: symbol;
}

/**
 * Creates a Slottable component with a specific owner name.
 * A Slottable component is used as a child of Slot to indicate that its children
 * should replace the Slot's children in the rendered output.
 *
 * @param {string} ownerName - The name to use in the component's displayName
 */
function createSlottable(ownerName: string) {
	const Slottable: SlottableComponent = ({ children }) => {
		return <>{children}</>;
	};
	Slottable.displayName = `${ownerName}.Slottable`;
	Slottable.__squaredId = SLOTTABLE_IDENTIFIER;
	return Slottable;
}

const Slottable = createSlottable("Slottable");

/* ---------------------------------------------------------------------------------------------- */

// biome-ignore lint/suspicious/noExplicitAny: We need to support any props
type AnyProps = Record<string, any>;

/**
 * Determines if a React child is a Slottable component.
 * This is used by the Slot component to identify when to use special slot behavior.
 */
function isSlottable(
	child: React.ReactNode,
): child is React.ReactElement<SlottableProps, typeof Slottable> {
	return (
		React.isValidElement(child) &&
		typeof child.type === "function" &&
		"__squaredId" in child.type &&
		child.type.__squaredId === SLOTTABLE_IDENTIFIER
	);
}

/**
 * Merges props from a slot and its child with special handling for event handlers,
 * style and className props.
 * - Event handlers are composed to run both the slot's and child's handlers
 * - Style objects are merged
 * - ClassNames are concatenated
 * - All other props from the child override the slot's props
 *
 * @param {AnyProps} slotProps - Props from the slot component
 * @param {AnyProps} childProps - Props from the child component
 */
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
					const result = childPropValue(...args);
					slotPropValue(...args);
					return result;
				};
			}
			// but if it exists only on the slot, we use only this one
			else if (slotPropValue) {
				overrideProps[propName] = slotPropValue;
			}
		}
		// if it's `style`, we merge them
		else if (propName === "style") {
			overrideProps[propName] = { ...slotPropValue, ...childPropValue };
			// if it's `className`, we deduplicate and merge them
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
/**
 * Gets the ref from a React element in a way that's compatible with both React 18 and 19.
 * Handles the different ways refs are accessed in different React versions to avoid warnings.
 *
 * @param {React.ReactElement & { ref?: React.Ref<unknown> }} element - The React element to get the ref from
 * @returns {React.Ref<unknown> | undefined} The ref of the element
 */
function getElementRef(
	element: React.ReactElement & { ref?: React.Ref<unknown> },
) {
	// React <=18 in DEV
	let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
	let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) {
		return element.ref;
	}

	// React 19 in DEV
	getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
	mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) {
		return (element.props as { ref?: React.Ref<unknown> }).ref;
	}

	// Not DEV
	return (element.props as { ref?: React.Ref<unknown> }).ref || element.ref;
}

export {
	createSlot,
	createSlottable,
	Slot,
	Slottable,
	//
	Slot as Root,
};
export type { SlotProps };
