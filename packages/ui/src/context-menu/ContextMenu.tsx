import * as React from 'react';

import type { Scope } from '../context';
import { createContextScope } from '../context';
import { createMenuScope } from '../menu';
import * as MenuPrimitive from '../menu';
import { composeEventHandlers } from '../primitive';
import { Primitive } from '../react-primitive';
import { useCallbackRef } from '../use-callback-ref';
import { useControllableState } from '../use-controllable-state';

type Direction = 'ltr' | 'rtl';
type Point = { x: number; y: number };

/* -------------------------------------------------------------------------------------------------
 * ContextMenu
 * -----------------------------------------------------------------------------------------------*/

const CONTEXT_MENU_NAME = 'ContextMenu';

type ScopedProps<P> = P & { __scopeContextMenu?: Scope };
const [createContextMenuContext, createContextMenuScope] = createContextScope(CONTEXT_MENU_NAME, [
  createMenuScope,
]);
const useMenuScope = createMenuScope();

type ContextMenuContextValue = {
  open: boolean;
  onOpenChange(open: boolean): void;
  modal: boolean;
};

const [ContextMenuProvider, useContextMenuContext] =
  createContextMenuContext<ContextMenuContextValue>(CONTEXT_MENU_NAME);

interface ContextMenuProps {
  children?: React.ReactNode;
  onOpenChange?(open: boolean): void;
  dir?: Direction;
  modal?: boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = (props: ScopedProps<ContextMenuProps>) => {
  const { __scopeContextMenu, children, onOpenChange, dir, modal = true } = props;
  const [open, setOpen] = React.useState(false);
  const menuScope = useMenuScope(__scopeContextMenu);
  const handleOpenChangeProp = useCallbackRef(onOpenChange);

  const handleOpenChange = React.useCallback(
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
      <MenuPrimitive.Menu
        {...menuScope}
        dir={dir}
        open={open}
        onOpenChange={handleOpenChange}
        modal={modal}
      >
        {children}
      </MenuPrimitive.Menu>
    </ContextMenuProvider>
  );
};

ContextMenu.displayName = CONTEXT_MENU_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'ContextMenuTrigger';

type ContextMenuTriggerElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
interface ContextMenuTriggerProps extends PrimitiveSpanProps {
  disabled?: boolean;
}

const ContextMenuTrigger = React.forwardRef<ContextMenuTriggerElement, ContextMenuTriggerProps>(
  (props: ScopedProps<ContextMenuTriggerProps>, forwardedRef) => {
    const { __scopeContextMenu, disabled = false, ...triggerProps } = props;
    const context = useContextMenuContext(TRIGGER_NAME, __scopeContextMenu);
    const menuScope = useMenuScope(__scopeContextMenu);
    const pointRef = React.useRef<Point>({ x: 0, y: 0 });
    const virtualRef = React.useRef({
      getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...pointRef.current }),
    });
    const longPressTimerRef = React.useRef(0);
    const clearLongPress = React.useCallback(
      () => window.clearTimeout(longPressTimerRef.current),
      [],
    );
    const handleOpen = (event: React.MouseEvent | React.PointerEvent) => {
      pointRef.current = { x: event.clientX, y: event.clientY };
      context.onOpenChange(true);
    };

    React.useEffect(() => clearLongPress, [clearLongPress]);
    React.useEffect(() => void (disabled && clearLongPress()), [disabled, clearLongPress]);

    return (
      <>
        <MenuPrimitive.MenuAnchor {...menuScope} virtualRef={virtualRef} />
        <Primitive.span
          data-state={context.open ? 'open' : 'closed'}
          data-disabled={disabled ? '' : undefined}
          {...triggerProps}
          ref={forwardedRef}
          // prevent iOS context menu from appearing
          style={{ WebkitTouchCallout: 'none', ...props.style }}
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
                    longPressTimerRef.current = window.setTimeout(() => handleOpen(event), 700);
                  }),
                )
          }
          onPointerMove={
            disabled
              ? props.onPointerMove
              : composeEventHandlers(props.onPointerMove, whenTouchOrPen(clearLongPress))
          }
          onPointerCancel={
            disabled
              ? props.onPointerCancel
              : composeEventHandlers(props.onPointerCancel, whenTouchOrPen(clearLongPress))
          }
          onPointerUp={
            disabled
              ? props.onPointerUp
              : composeEventHandlers(props.onPointerUp, whenTouchOrPen(clearLongPress))
          }
        />
      </>
    );
  },
);

ContextMenuTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'ContextMenuPortal';

type MenuPortalProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.MenuPortal>;
interface ContextMenuPortalProps extends MenuPortalProps {}

const ContextMenuPortal: React.FC<ContextMenuPortalProps> = (
  props: ScopedProps<ContextMenuPortalProps>,
) => {
  const { __scopeContextMenu, ...portalProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return <MenuPrimitive.MenuPortal {...menuScope} {...portalProps} />;
};

ContextMenuPortal.displayName = PORTAL_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'ContextMenuContent';

type ContextMenuContentElement = React.ElementRef<typeof MenuPrimitive.MenuContent>;
type MenuContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.MenuContent>;
interface ContextMenuContentProps
  extends Omit<MenuContentProps, 'onEntryFocus' | 'side' | 'sideOffset' | 'align'> {}

const ContextMenuContent = React.forwardRef<ContextMenuContentElement, ContextMenuContentProps>(
  (props: ScopedProps<ContextMenuContentProps>, forwardedRef) => {
    const { __scopeContextMenu, ...contentProps } = props;
    const context = useContextMenuContext(CONTENT_NAME, __scopeContextMenu);
    const menuScope = useMenuScope(__scopeContextMenu);
    const hasInteractedOutsideRef = React.useRef(false);

    return (
      <MenuPrimitive.MenuContent
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

          if (!event.defaultPrevented && !context.modal) hasInteractedOutsideRef.current = true;
        }}
        style={{
          ...props.style,
          // re-namespace exposed content custom properties
          ...{
            '--sandy-context-menu-content-transform-origin': 'var(--sandy-popper-transform-origin)',
            '--sandy-context-menu-content-available-width': 'var(--sandy-popper-available-width)',
            '--sandy-context-menu-content-available-height': 'var(--sandy-popper-available-height)',
            '--sandy-context-menu-trigger-width': 'var(--sandy-popper-anchor-width)',
            '--sandy-context-menu-trigger-height': 'var(--sandy-popper-anchor-height)',
          },
        }}
      />
    );
  },
);

ContextMenuContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'ContextMenuGroup';

type ContextMenuGroupElement = React.ElementRef<typeof MenuPrimitive.MenuGroup>;
type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.MenuGroup>;
interface ContextMenuGroupProps extends MenuGroupProps {}

const ContextMenuGroup = React.forwardRef<ContextMenuGroupElement, ContextMenuGroupProps>(
  (props: ScopedProps<ContextMenuGroupProps>, forwardedRef) => {
    const { __scopeContextMenu, ...groupProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return <MenuPrimitive.MenuGroup {...menuScope} {...groupProps} ref={forwardedRef} />;
  },
);

ContextMenuGroup.displayName = GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'ContextMenuLabel';

type ContextMenuLabelElement = React.ElementRef<typeof MenuPrimitive.MenuLabel>;
type MenuLabelProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.MenuLabel>;
interface ContextMenuLabelProps extends MenuLabelProps {}

const ContextMenuLabel = React.forwardRef<ContextMenuLabelElement, ContextMenuLabelProps>(
  (props: ScopedProps<ContextMenuLabelProps>, forwardedRef) => {
    const { __scopeContextMenu, ...labelProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return <MenuPrimitive.MenuLabel {...menuScope} {...labelProps} ref={forwardedRef} />;
  },
);

ContextMenuLabel.displayName = LABEL_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'ContextMenuItem';

type ContextMenuItemElement = React.ElementRef<typeof MenuPrimitive.MenuItem>;
type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.MenuItem>;
interface ContextMenuItemProps extends MenuItemProps {}

const ContextMenuItem = React.forwardRef<ContextMenuItemElement, ContextMenuItemProps>(
  (props: ScopedProps<ContextMenuItemProps>, forwardedRef) => {
    const { __scopeContextMenu, ...itemProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return <MenuPrimitive.MenuItem {...menuScope} {...itemProps} ref={forwardedRef} />;
  },
);

ContextMenuItem.displayName = ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuCheckboxItem
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_ITEM_NAME = 'ContextMenuCheckboxItem';

type ContextMenuCheckboxItemElement = React.ElementRef<typeof MenuPrimitive.MenuCheckboxItem>;
type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.MenuCheckboxItem>;
interface ContextMenuCheckboxItemProps extends MenuCheckboxItemProps {}

const ContextMenuCheckboxItem = React.forwardRef<
  ContextMenuCheckboxItemElement,
  ContextMenuCheckboxItemProps
>((props: ScopedProps<ContextMenuCheckboxItemProps>, forwardedRef) => {
  const { __scopeContextMenu, ...checkboxItemProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return (
    <MenuPrimitive.MenuCheckboxItem {...menuScope} {...checkboxItemProps} ref={forwardedRef} />
  );
});

ContextMenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuRadioGroup
 * -----------------------------------------------------------------------------------------------*/

const RADIO_GROUP_NAME = 'ContextMenuRadioGroup';

type ContextMenuRadioGroupElement = React.ElementRef<typeof MenuPrimitive.MenuRadioGroup>;
type MenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.MenuRadioGroup>;
interface ContextMenuRadioGroupProps extends MenuRadioGroupProps {}

const ContextMenuRadioGroup = React.forwardRef<
  ContextMenuRadioGroupElement,
  ContextMenuRadioGroupProps
>((props: ScopedProps<ContextMenuRadioGroupProps>, forwardedRef) => {
  const { __scopeContextMenu, ...radioGroupProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return <MenuPrimitive.MenuRadioGroup {...menuScope} {...radioGroupProps} ref={forwardedRef} />;
});

ContextMenuRadioGroup.displayName = RADIO_GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuRadioItem
 * -----------------------------------------------------------------------------------------------*/

const RADIO_ITEM_NAME = 'ContextMenuRadioItem';

type ContextMenuRadioItemElement = React.ElementRef<typeof MenuPrimitive.MenuRadioItem>;
type MenuRadioItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.MenuRadioItem>;
interface ContextMenuRadioItemProps extends MenuRadioItemProps {}

const ContextMenuRadioItem = React.forwardRef<
  ContextMenuRadioItemElement,
  ContextMenuRadioItemProps
>((props: ScopedProps<ContextMenuRadioItemProps>, forwardedRef) => {
  const { __scopeContextMenu, ...radioItemProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return <MenuPrimitive.MenuRadioItem {...menuScope} {...radioItemProps} ref={forwardedRef} />;
});

ContextMenuRadioItem.displayName = RADIO_ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuItemIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'ContextMenuItemIndicator';

type ContextMenuItemIndicatorElement = React.ElementRef<typeof MenuPrimitive.MenuItemIndicator>;
type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<
  typeof MenuPrimitive.MenuItemIndicator
>;
interface ContextMenuItemIndicatorProps extends MenuItemIndicatorProps {}

const ContextMenuItemIndicator = React.forwardRef<
  ContextMenuItemIndicatorElement,
  ContextMenuItemIndicatorProps
>((props: ScopedProps<ContextMenuItemIndicatorProps>, forwardedRef) => {
  const { __scopeContextMenu, ...itemIndicatorProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return (
    <MenuPrimitive.MenuItemIndicator {...menuScope} {...itemIndicatorProps} ref={forwardedRef} />
  );
});

ContextMenuItemIndicator.displayName = INDICATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'ContextMenuSeparator';

type ContextMenuSeparatorElement = React.ElementRef<typeof MenuPrimitive.MenuSeparator>;
type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.MenuSeparator>;
interface ContextMenuSeparatorProps extends MenuSeparatorProps {}

const ContextMenuSeparator = React.forwardRef<
  ContextMenuSeparatorElement,
  ContextMenuSeparatorProps
>((props: ScopedProps<ContextMenuSeparatorProps>, forwardedRef) => {
  const { __scopeContextMenu, ...separatorProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return <MenuPrimitive.MenuSeparator {...menuScope} {...separatorProps} ref={forwardedRef} />;
});

ContextMenuSeparator.displayName = SEPARATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'ContextMenuArrow';

type ContextMenuArrowElement = React.ElementRef<typeof MenuPrimitive.MenuArrow>;
type MenuArrowProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.MenuArrow>;
interface ContextMenuArrowProps extends MenuArrowProps {}

const ContextMenuArrow = React.forwardRef<ContextMenuArrowElement, ContextMenuArrowProps>(
  (props: ScopedProps<ContextMenuArrowProps>, forwardedRef) => {
    const { __scopeContextMenu, ...arrowProps } = props;
    const menuScope = useMenuScope(__scopeContextMenu);
    return <MenuPrimitive.MenuArrow {...menuScope} {...arrowProps} ref={forwardedRef} />;
  },
);

ContextMenuArrow.displayName = ARROW_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSub
 * -----------------------------------------------------------------------------------------------*/

const SUB_NAME = 'ContextMenuSub';

interface ContextMenuSubProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
}

const ContextMenuSub: React.FC<ContextMenuSubProps> = (props: ScopedProps<ContextMenuSubProps>) => {
  const { __scopeContextMenu, children, onOpenChange, open: openProp, defaultOpen } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <MenuPrimitive.MenuSub {...menuScope} open={open} onOpenChange={setOpen}>
      {children}
    </MenuPrimitive.MenuSub>
  );
};

ContextMenuSub.displayName = SUB_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSubTrigger
 * -----------------------------------------------------------------------------------------------*/

const SUB_TRIGGER_NAME = 'ContextMenuSubTrigger';

type ContextMenuSubTriggerElement = React.ElementRef<typeof MenuPrimitive.MenuSubTrigger>;
type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.MenuSubTrigger>;
interface ContextMenuSubTriggerProps extends MenuSubTriggerProps {}

const ContextMenuSubTrigger = React.forwardRef<
  ContextMenuSubTriggerElement,
  ContextMenuSubTriggerProps
>((props: ScopedProps<ContextMenuSubTriggerProps>, forwardedRef) => {
  const { __scopeContextMenu, ...triggerItemProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);
  return <MenuPrimitive.MenuSubTrigger {...menuScope} {...triggerItemProps} ref={forwardedRef} />;
});

ContextMenuSubTrigger.displayName = SUB_TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSubContent
 * -----------------------------------------------------------------------------------------------*/

const SUB_CONTENT_NAME = 'ContextMenuSubContent';

type ContextMenuSubContentElement = React.ElementRef<typeof MenuPrimitive.MenuContent>;
type MenuSubContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.MenuSubContent>;
interface ContextMenuSubContentProps extends MenuSubContentProps {}

const ContextMenuSubContent = React.forwardRef<
  ContextMenuSubContentElement,
  ContextMenuSubContentProps
>((props: ScopedProps<ContextMenuSubContentProps>, forwardedRef) => {
  const { __scopeContextMenu, ...subContentProps } = props;
  const menuScope = useMenuScope(__scopeContextMenu);

  return (
    <MenuPrimitive.MenuSubContent
      {...menuScope}
      {...subContentProps}
      ref={forwardedRef}
      style={{
        ...props.style,
        // re-namespace exposed content custom properties
        ...{
          '--sandy-context-menu-content-transform-origin': 'var(--sandy-popper-transform-origin)',
          '--sandy-context-menu-content-available-width': 'var(--sandy-popper-available-width)',
          '--sandy-context-menu-content-available-height': 'var(--sandy-popper-available-height)',
          '--sandy-context-menu-trigger-width': 'var(--sandy-popper-anchor-width)',
          '--sandy-context-menu-trigger-height': 'var(--sandy-popper-anchor-height)',
        },
      }}
    />
  );
});

ContextMenuSubContent.displayName = SUB_CONTENT_NAME;

/* -----------------------------------------------------------------------------------------------*/

function whenTouchOrPen<E>(handler: React.PointerEventHandler<E>): React.PointerEventHandler<E> {
  return (event) => (event.pointerType !== 'mouse' ? handler(event) : undefined);
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
  createContextMenuScope,
  //
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuPortal,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuItemIndicator,
  ContextMenuSeparator,
  ContextMenuArrow,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  //
  Root,
  Trigger,
  Portal,
  Content,
  Group,
  Label,
  Item,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  ItemIndicator,
  Separator,
  Arrow,
  Sub,
  SubTrigger,
  SubContent,
};
export type {
  ContextMenuProps,
  ContextMenuTriggerProps,
  ContextMenuPortalProps,
  ContextMenuContentProps,
  ContextMenuGroupProps,
  ContextMenuLabelProps,
  ContextMenuItemProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuItemIndicatorProps,
  ContextMenuSeparatorProps,
  ContextMenuArrowProps,
  ContextMenuSubProps,
  ContextMenuSubTriggerProps,
  ContextMenuSubContentProps,
};
