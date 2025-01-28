import {
	type ComponentPropsWithoutRef,
	type ElementRef,
	type FC,
	type MouseEvent,
	type PointerEvent,
	type ReactNode,
	forwardRef,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { type Scope, createContextScope } from "../context";
import * as MenuPrimitive from "../menu";
import { createMenuScope } from "../menu";
import { composeEventHandlers } from "../primitive";
import { Primitive } from "../react-primitive";
import { useCallbackRef } from "../use-callback-ref";
import { useControllableState } from "../use-controllable-state";

type Direction = "ltr" | "rtl";
type Point = { x: number; y: number };

/* -------------------------------------------------------------------------------------------------
 * ContextMenu
 * -----------------------------------------------------------------------------------------------*/

const CONTEXT_MENU_NAME = "ContextMenu";

type ScopedProps<P> = P & { __scopeContextMenu?: Scope };
const [createContextMenuContext, createContextMenuScope] = createContextScope(
	CONTEXT_MENU_NAME,
	[createMenuScope],
);
const useMenuScope = createMenuScope();

type ContextMenuContextValue = {
	open: boolean;
	onOpenChange(open: boolean): void;
	modal: boolean;
};

const [ContextMenuProvider, useContextMenuContext] =
	createContextMenuContext<ContextMenuContextValue>(CONTEXT_MENU_NAME);

interface ContextMenuProps {
	children?: ReactNode;
	onOpenChange?(open: boolean): void;
	dir?: Direction;
	modal?: boolean;
}

const ContextMenu: FC<ContextMenuProps> = (
	props: ScopedProps<ContextMenuProps>,
) => {
	const {
		__scopeContextMenu,
		children,
		onOpenChange,
		dir,
		modal = true,
	} = props;
	const [open, setOpen] = useState(false);
	const menuScope = useMenuScope(__scopeContextMenu);
	const handleOpenChangeProp = useCallbackRef(onOpenChange);

	const handleOpenChange = useCallback(
		(open: boolean) => {
			setOpen(open);
			handleOpenChangeProp(open);
		},
		[handleOpenChangeProp],
	);

	return (
		<ContextMenuProvider
			scope={__scopeContextMenu}
			open={open}
			onOpenChange={handleOpenChange}
			modal={modal}
		>
			<MenuPrimitive.Root
				{...menuScope}
				dir={dir}
				open={open}
				onOpenChange={handleOpenChange}
				modal={modal}
			>
				{children}
			</MenuPrimitive.Root>
		</ContextMenuProvider>
	);
};

ContextMenu.displayName = CONTEXT_MENU_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = "ContextMenuTrigger";

type ContextMenuTriggerElement = ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = ComponentPropsWithoutRef<typeof Primitive.span>;
interface ContextMenuTriggerProps extends PrimitiveSpanProps {
	disabled?: boolean;
}

const ContextMenuTrigger = forwardRef<
	ContextMenuTriggerElement,
	ContextMenuTriggerProps
>((props: ScopedProps<ContextMenuTriggerProps>, forwardedRef) => {
	const { __scopeContextMenu, disabled = false, ...triggerProps } = props;
	const context = useContextMenuContext(TRIGGER_NAME, __scopeContextMenu);
	const menuScope = useMenuScope(__scopeContextMenu);
	const pointRef = useRef<Point>({ x: 0, y: 0 });
	const virtualRef = useRef({
		getBoundingClientRect: () =>
			DOMRect.fromRect({ width: 0, height: 0, ...pointRef.current }),
	});
	const longPressTimerRef = useRef(0);
	const clearLongPress = useCallback(
		() => window.clearTimeout(longPressTimerRef.current),
		[],
	);
	const handleOpen = (event: MouseEvent | PointerEvent) => {
		pointRef.current = { x: event.clientX, y: event.clientY };
		context.onOpenChange(true);
	};

	useEffect(() => clearLongPress, [clearLongPress]);
	useEffect(
		() => void (disabled && clearLongPress()),
		[disabled, clearLongPress],
	);

	return (
		<>
			<MenuPrimitive.Anchor {...menuScope} virtualRef={virtualRef} />
			<Primitive.span
				data-state={context.open ? "open" : "closed"}
				data-disabled={disabled ? "" : undefined}
				{...triggerProps}
				ref={forwardedRef}
				// prevent iOS context menu from appearing
				style={{ WebkitTouchCallout: "none", ...props.style }}
				// if trigger is disabled, enable the native Context Menu
				onContextMenu={
					disabled
						? props.onContextMenu
						: composeEventHandlers(props.onContextMenu, (event) => {
								// clearing the long press here because some platforms already support
								// long press to trigger a `contextmenu` event
								clearLongPress();
								handleOpen(event);
								event.preventDefault();
							})
				}
				onPointerDown={
					disabled
						? props.onPointerDown
						: composeEventHandlers(
								props.onPointerDown,
								whenTouchOrPen((event) => {
									// clear the long press here in case there's multiple touch points
									clearLongPress();
									longPressTimerRef.current = window.setTimeout(
										() => handleOpen(event),
										700,
									);
								}),
							)
				}
				onPointerMove={
					disabled
						? props.onPointerMove
						: composeEventHandlers(
								props.onPointerMove,
								whenTouchOrPen(clearLongPress),
							)
				}
				onPointerCancel={
					disabled
						? props.onPointerCancel
						: composeEventHandlers(
								props.onPointerCancel,
								whenTouchOrPen(clearLongPress),
							)
				}
				onPointerUp={
					disabled
						? props.onPointerUp
						: composeEventHandlers(
								props.onPointerUp,
								whenTouchOrPen(clearLongPress),
							)
				}
			/>
		</>
	);
});

ContextMenuTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = "ContextMenuPortal";

type MenuPortalProps = ComponentPropsWithoutRef<typeof MenuPrimitive.Portal>;
interface ContextMenuPortalProps extends MenuPortalProps {}

const ContextMenuPortal: FC<ContextMenuPortalProps> = (
	props: ScopedProps<ContextMenuPortalProps>,
) => {
	const { __scopeContextMenu, ...portalProps } = props;
	const menuScope = useMenuScope(__scopeContextMenu);
	return <MenuPrimitive.Portal {...menuScope} {...portalProps} />;
};

ContextMenuPortal.displayName = PORTAL_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = "ContextMenuContent";

type ContextMenuContentElement = ElementRef<typeof MenuPrimitive.Content>;
type MenuContentProps = ComponentPropsWithoutRef<typeof MenuPrimitive.Content>;
interface ContextMenuContentProps
	extends Omit<
		MenuContentProps,
		"onEntryFocus" | "side" | "sideOffset" | "align"
	> {}

const ContextMenuContent = forwardRef<
	ContextMenuContentElement,
	ContextMenuContentProps
>((props: ScopedProps<ContextMenuContentProps>, forwardedRef) => {
	const { __scopeContextMenu, ...contentProps } = props;
	const context = useContextMenuContext(CONTENT_NAME, __scopeContextMenu);
	const menuScope = useMenuScope(__scopeContextMenu);
	const hasInteractedOutsideRef = useRef(false);

	return (
		<MenuPrimitive.Content
			{...menuScope}
			{...contentProps}
			ref={forwardedRef}
			side="right"
			sideOffset={2}
			align="start"
			onCloseAutoFocus={(event) => {
				props.onCloseAutoFocus?.(event);

				if (!event.defaultPrevented && hasInteractedOutsideRef.current) {
					event.preventDefault();
				}

				hasInteractedOutsideRef.current = false;
			}}
			onInteractOutside={(event) => {
				props.onInteractOutside?.(event);

				if (!event.defaultPrevented && !context.modal)
					hasInteractedOutsideRef.current = true;
			}}
			style={{
				...props.style,
				// re-namespace exposed content custom properties
				...{
					"--radix-context-menu-content-transform-origin":
						"var(--radix-popper-transform-origin)",
					"--radix-context-menu-content-available-width":
						"var(--radix-popper-available-width)",
					"--radix-context-menu-content-available-height":
						"var(--radix-popper-available-height)",
					"--radix-context-menu-trigger-width":
						"var(--radix-popper-anchor-width)",
					"--radix-context-menu-trigger-height":
						"var(--radix-popper-anchor-height)",
				},
			}}
		/>
	);
});

ContextMenuContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = "ContextMenuGroup";

type ContextMenuGroupElement = ElementRef<typeof MenuPrimitive.Group>;
type MenuGroupProps = ComponentPropsWithoutRef<typeof MenuPrimitive.Group>;
interface ContextMenuGroupProps extends MenuGroupProps {}

const ContextMenuGroup = forwardRef<
	ContextMenuGroupElement,
	ContextMenuGroupProps
>((props: ScopedProps<ContextMenuGroupProps>, forwardedRef) => {
	const { __scopeContextMenu, ...groupProps } = props;
	const menuScope = useMenuScope(__scopeContextMenu);
	return (
		<MenuPrimitive.Group {...menuScope} {...groupProps} ref={forwardedRef} />
	);
});

ContextMenuGroup.displayName = GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = "ContextMenuLabel";

type ContextMenuLabelElement = ElementRef<typeof MenuPrimitive.Label>;
type MenuLabelProps = ComponentPropsWithoutRef<typeof MenuPrimitive.Label>;
interface ContextMenuLabelProps extends MenuLabelProps {}

const ContextMenuLabel = forwardRef<
	ContextMenuLabelElement,
	ContextMenuLabelProps
>((props: ScopedProps<ContextMenuLabelProps>, forwardedRef) => {
	const { __scopeContextMenu, ...labelProps } = props;
	const menuScope = useMenuScope(__scopeContextMenu);
	return (
		<MenuPrimitive.Label {...menuScope} {...labelProps} ref={forwardedRef} />
	);
});

ContextMenuLabel.displayName = LABEL_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = "ContextMenuItem";

type ContextMenuItemElement = ElementRef<typeof MenuPrimitive.Item>;
type MenuItemProps = ComponentPropsWithoutRef<typeof MenuPrimitive.Item>;
interface ContextMenuItemProps extends MenuItemProps {}

const ContextMenuItem = forwardRef<
	ContextMenuItemElement,
	ContextMenuItemProps
>((props: ScopedProps<ContextMenuItemProps>, forwardedRef) => {
	const { __scopeContextMenu, ...itemProps } = props;
	const menuScope = useMenuScope(__scopeContextMenu);
	return (
		<MenuPrimitive.Item {...menuScope} {...itemProps} ref={forwardedRef} />
	);
});

ContextMenuItem.displayName = ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuCheckboxItem
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_ITEM_NAME = "ContextMenuCheckboxItem";

type ContextMenuCheckboxItemElement = ElementRef<
	typeof MenuPrimitive.CheckboxItem
>;
type MenuCheckboxItemProps = ComponentPropsWithoutRef<
	typeof MenuPrimitive.CheckboxItem
>;
interface ContextMenuCheckboxItemProps extends MenuCheckboxItemProps {}

const ContextMenuCheckboxItem = forwardRef<
	ContextMenuCheckboxItemElement,
	ContextMenuCheckboxItemProps
>((props: ScopedProps<ContextMenuCheckboxItemProps>, forwardedRef) => {
	const { __scopeContextMenu, ...checkboxItemProps } = props;
	const menuScope = useMenuScope(__scopeContextMenu);
	return (
		<MenuPrimitive.CheckboxItem
			{...menuScope}
			{...checkboxItemProps}
			ref={forwardedRef}
		/>
	);
});

ContextMenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuRadioGroup
 * -----------------------------------------------------------------------------------------------*/

const RADIO_GROUP_NAME = "ContextMenuRadioGroup";

type ContextMenuRadioGroupElement = ElementRef<typeof MenuPrimitive.RadioGroup>;
type MenuRadioGroupProps = ComponentPropsWithoutRef<
	typeof MenuPrimitive.RadioGroup
>;
interface ContextMenuRadioGroupProps extends MenuRadioGroupProps {}

const ContextMenuRadioGroup = forwardRef<
	ContextMenuRadioGroupElement,
	ContextMenuRadioGroupProps
>((props: ScopedProps<ContextMenuRadioGroupProps>, forwardedRef) => {
	const { __scopeContextMenu, ...radioGroupProps } = props;
	const menuScope = useMenuScope(__scopeContextMenu);
	return (
		<MenuPrimitive.RadioGroup
			{...menuScope}
			{...radioGroupProps}
			ref={forwardedRef}
		/>
	);
});

ContextMenuRadioGroup.displayName = RADIO_GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuRadioItem
 * -----------------------------------------------------------------------------------------------*/

const RADIO_ITEM_NAME = "ContextMenuRadioItem";

type ContextMenuRadioItemElement = ElementRef<typeof MenuPrimitive.RadioItem>;
type MenuRadioItemProps = ComponentPropsWithoutRef<
	typeof MenuPrimitive.RadioItem
>;
interface ContextMenuRadioItemProps extends MenuRadioItemProps {}

const ContextMenuRadioItem = forwardRef<
	ContextMenuRadioItemElement,
	ContextMenuRadioItemProps
>((props: ScopedProps<ContextMenuRadioItemProps>, forwardedRef) => {
	const { __scopeContextMenu, ...radioItemProps } = props;
	const menuScope = useMenuScope(__scopeContextMenu);
	return (
		<MenuPrimitive.RadioItem
			{...menuScope}
			{...radioItemProps}
			ref={forwardedRef}
		/>
	);
});

ContextMenuRadioItem.displayName = RADIO_ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuItemIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = "ContextMenuItemIndicator";

type ContextMenuItemIndicatorElement = ElementRef<
	typeof MenuPrimitive.ItemIndicator
>;
type MenuItemIndicatorProps = ComponentPropsWithoutRef<
	typeof MenuPrimitive.ItemIndicator
>;
interface ContextMenuItemIndicatorProps extends MenuItemIndicatorProps {}

const ContextMenuItemIndicator = forwardRef<
	ContextMenuItemIndicatorElement,
	ContextMenuItemIndicatorProps
>((props: ScopedProps<ContextMenuItemIndicatorProps>, forwardedRef) => {
	const { __scopeContextMenu, ...itemIndicatorProps } = props;
	const menuScope = useMenuScope(__scopeContextMenu);
	return (
		<MenuPrimitive.ItemIndicator
			{...menuScope}
			{...itemIndicatorProps}
			ref={forwardedRef}
		/>
	);
});

ContextMenuItemIndicator.displayName = INDICATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = "ContextMenuSeparator";

type ContextMenuSeparatorElement = ElementRef<typeof MenuPrimitive.Separator>;
type MenuSeparatorProps = ComponentPropsWithoutRef<
	typeof MenuPrimitive.Separator
>;
interface ContextMenuSeparatorProps extends MenuSeparatorProps {}

const ContextMenuSeparator = forwardRef<
	ContextMenuSeparatorElement,
	ContextMenuSeparatorProps
>((props: ScopedProps<ContextMenuSeparatorProps>, forwardedRef) => {
	const { __scopeContextMenu, ...separatorProps } = props;
	const menuScope = useMenuScope(__scopeContextMenu);
	return (
		<MenuPrimitive.Separator
			{...menuScope}
			{...separatorProps}
			ref={forwardedRef}
		/>
	);
});

ContextMenuSeparator.displayName = SEPARATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = "ContextMenuArrow";

type ContextMenuArrowElement = ElementRef<typeof MenuPrimitive.Arrow>;
type MenuArrowProps = ComponentPropsWithoutRef<typeof MenuPrimitive.Arrow>;
interface ContextMenuArrowProps extends MenuArrowProps {}

const ContextMenuArrow = forwardRef<
	ContextMenuArrowElement,
	ContextMenuArrowProps
>((props: ScopedProps<ContextMenuArrowProps>, forwardedRef) => {
	const { __scopeContextMenu, ...arrowProps } = props;
	const menuScope = useMenuScope(__scopeContextMenu);
	return (
		<MenuPrimitive.Arrow {...menuScope} {...arrowProps} ref={forwardedRef} />
	);
});

ContextMenuArrow.displayName = ARROW_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSub
 * -----------------------------------------------------------------------------------------------*/

const SUB_NAME = "ContextMenuSub";

interface ContextMenuSubProps {
	children?: ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?(open: boolean): void;
}

const ContextMenuSub: FC<ContextMenuSubProps> = (
	props: ScopedProps<ContextMenuSubProps>,
) => {
	const {
		__scopeContextMenu,
		children,
		onOpenChange,
		open: openProp,
		defaultOpen,
	} = props;
	const menuScope = useMenuScope(__scopeContextMenu);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen,
		onChange: onOpenChange,
	});

	return (
		<MenuPrimitive.Sub {...menuScope} open={open} onOpenChange={setOpen}>
			{children}
		</MenuPrimitive.Sub>
	);
};

ContextMenuSub.displayName = SUB_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSubTrigger
 * -----------------------------------------------------------------------------------------------*/

const SUB_TRIGGER_NAME = "ContextMenuSubTrigger";

type ContextMenuSubTriggerElement = ElementRef<typeof MenuPrimitive.SubTrigger>;
type MenuSubTriggerProps = ComponentPropsWithoutRef<
	typeof MenuPrimitive.SubTrigger
>;
interface ContextMenuSubTriggerProps extends MenuSubTriggerProps {}

const ContextMenuSubTrigger = forwardRef<
	ContextMenuSubTriggerElement,
	ContextMenuSubTriggerProps
>((props: ScopedProps<ContextMenuSubTriggerProps>, forwardedRef) => {
	const { __scopeContextMenu, ...triggerItemProps } = props;
	const menuScope = useMenuScope(__scopeContextMenu);
	return (
		<MenuPrimitive.SubTrigger
			{...menuScope}
			{...triggerItemProps}
			ref={forwardedRef}
		/>
	);
});

ContextMenuSubTrigger.displayName = SUB_TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSubContent
 * -----------------------------------------------------------------------------------------------*/

const SUB_CONTENT_NAME = "ContextMenuSubContent";

type ContextMenuSubContentElement = ElementRef<typeof MenuPrimitive.Content>;
type MenuSubContentProps = ComponentPropsWithoutRef<
	typeof MenuPrimitive.SubContent
>;
interface ContextMenuSubContentProps extends MenuSubContentProps {}

const ContextMenuSubContent = forwardRef<
	ContextMenuSubContentElement,
	ContextMenuSubContentProps
>((props: ScopedProps<ContextMenuSubContentProps>, forwardedRef) => {
	const { __scopeContextMenu, ...subContentProps } = props;
	const menuScope = useMenuScope(__scopeContextMenu);

	return (
		<MenuPrimitive.SubContent
			{...menuScope}
			{...subContentProps}
			ref={forwardedRef}
			style={{
				...props.style,
				// re-namespace exposed content custom properties
				...{
					"--radix-context-menu-content-transform-origin":
						"var(--radix-popper-transform-origin)",
					"--radix-context-menu-content-available-width":
						"var(--radix-popper-available-width)",
					"--radix-context-menu-content-available-height":
						"var(--radix-popper-available-height)",
					"--radix-context-menu-trigger-width":
						"var(--radix-popper-anchor-width)",
					"--radix-context-menu-trigger-height":
						"var(--radix-popper-anchor-height)",
				},
			}}
		/>
	);
});

ContextMenuSubContent.displayName = SUB_CONTENT_NAME;

/* -----------------------------------------------------------------------------------------------*/

function whenTouchOrPen<E>(
	handler: React.PointerEventHandler<E>,
): React.PointerEventHandler<E> {
	return (event) =>
		event.pointerType !== "mouse" ? handler(event) : undefined;
}

const Root = ContextMenu;
const Trigger = ContextMenuTrigger;
const Portal = ContextMenuPortal;
const Content = ContextMenuContent;
const Group = ContextMenuGroup;
const Label = ContextMenuLabel;
const Item = ContextMenuItem;
const CheckboxItem = ContextMenuCheckboxItem;
const RadioGroup = ContextMenuRadioGroup;
const RadioItem = ContextMenuRadioItem;
const ItemIndicator = ContextMenuItemIndicator;
const Separator = ContextMenuSeparator;
const Arrow = ContextMenuArrow;
const Sub = ContextMenuSub;
const SubTrigger = ContextMenuSubTrigger;
const SubContent = ContextMenuSubContent;

export {
	Arrow,
	CheckboxItem,
	Content,
	//
	ContextMenu,
	ContextMenuArrow,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuItemIndicator,
	ContextMenuLabel,
	ContextMenuPortal,
	ContextMenuRadioGroup,
	ContextMenuRadioItem,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
	Group,
	Item,
	ItemIndicator,
	Label,
	Portal,
	RadioGroup,
	RadioItem,
	//
	Root,
	Separator,
	Sub,
	SubContent,
	SubTrigger,
	Trigger,
	createContextMenuScope,
};
export type {
	ContextMenuArrowProps,
	ContextMenuCheckboxItemProps,
	ContextMenuContentProps,
	ContextMenuGroupProps,
	ContextMenuItemIndicatorProps,
	ContextMenuItemProps,
	ContextMenuLabelProps,
	ContextMenuPortalProps,
	ContextMenuProps,
	ContextMenuRadioGroupProps,
	ContextMenuRadioItemProps,
	ContextMenuSeparatorProps,
	ContextMenuSubContentProps,
	ContextMenuSubProps,
	ContextMenuSubTriggerProps,
	ContextMenuTriggerProps,
};
