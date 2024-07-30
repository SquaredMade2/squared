import * as React from "react";

import { DirectionProvider } from "../direction";
import * as Menu from "../menu";

import { css, keyframes } from "../../stitches.config";
import { foodGroups } from "../../test-data/foods";

export default {
  title: "Utilities/Menu",
  excludeStories: ["TickIcon", "classes"],
};

export const Styled = () => (
  <MenuWithAnchor>
    <Menu.MenuItem
      className={itemClass()}
      onSelect={() => window.alert("undo")}
    >
      Undo
    </Menu.MenuItem>
    <Menu.MenuItem
      className={itemClass()}
      onSelect={() => window.alert("redo")}
    >
      Redo
    </Menu.MenuItem>
    <Menu.MenuSeparator className={separatorClass()} />
    <Menu.MenuItem
      className={itemClass()}
      disabled
      onSelect={() => window.alert("cut")}
    >
      Cut
    </Menu.MenuItem>
    <Menu.MenuItem
      className={itemClass()}
      onSelect={() => window.alert("copy")}
    >
      Copy
    </Menu.MenuItem>
    <Menu.MenuItem
      className={itemClass()}
      onSelect={() => window.alert("paste")}
    >
      Paste
    </Menu.MenuItem>
  </MenuWithAnchor>
);

export const Submenus = () => {
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [rtl, setRtl] = React.useState(false);
  const [animated, setAnimated] = React.useState(false);

  React.useEffect(() => {
    if (rtl) {
      document.documentElement.setAttribute("dir", "rtl");
      return () => document.documentElement.removeAttribute("dir");
    }
  }, [rtl]);

  return (
    <DirectionProvider dir={rtl ? "rtl" : "ltr"}>
      <div
        style={{
          marginBottom: 8,
          display: "grid",
          gridAutoFlow: "row",
          gap: 4,
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={rtl}
            onChange={(event) => setRtl(event.currentTarget.checked)}
          />
          Right-to-left
        </label>
        <label>
          <input
            type="checkbox"
            checked={animated}
            onChange={(event) =>
              setAnimated(event.currentTarget.checked)
            }
          />
          Animated
        </label>
      </div>
      <MenuWithAnchor>
        <Menu.MenuItem
          className={itemClass()}
          onSelect={() => window.alert("undo")}
        >
          Undo
        </Menu.MenuItem>
        <Submenu
          open={open1}
          onOpenChange={setOpen1}
          animated={animated}
        >
          <Menu.MenuItem className={itemClass()} disabled>
            Disabled
          </Menu.MenuItem>
          <Menu.MenuItem
            className={itemClass()}
            onSelect={() => window.alert("one")}
          >
            One
          </Menu.MenuItem>
          <Submenu
            open={open2}
            onOpenChange={setOpen2}
            animated={animated}
          >
            <Menu.MenuItem
              className={itemClass()}
              onSelect={() => window.alert("one")}
            >
              One
            </Menu.MenuItem>
            <Menu.MenuItem
              className={itemClass()}
              onSelect={() => window.alert("two")}
            >
              Two
            </Menu.MenuItem>
            <Menu.MenuItem
              className={itemClass()}
              onSelect={() => window.alert("three")}
            >
              Three
            </Menu.MenuItem>
            <Menu.MenuItem
              className={itemClass()}
              onSelect={() => window.alert("four")}
            >
              Four
            </Menu.MenuItem>
            <Menu.MenuItem
              className={itemClass()}
              onSelect={() => window.alert("five")}
            >
              Five
            </Menu.MenuItem>
            <Menu.MenuItem
              className={itemClass()}
              onSelect={() => window.alert("six")}
            >
              Six
            </Menu.MenuItem>
          </Submenu>
          <Submenu
            heading="Sub Menu"
            open={open3}
            onOpenChange={setOpen3}
            animated={animated}
          >
            <Menu.MenuItem
              className={itemClass()}
              onSelect={() => window.alert("one")}
            >
              One
            </Menu.MenuItem>
            <Menu.MenuItem
              className={itemClass()}
              onSelect={() => window.alert("two")}
            >
              Two
            </Menu.MenuItem>
            <Menu.MenuItem
              className={itemClass()}
              onSelect={() => window.alert("three")}
            >
              Three
            </Menu.MenuItem>
          </Submenu>
          <Menu.MenuItem
            className={itemClass()}
            onSelect={() => window.alert("two")}
          >
            Two
          </Menu.MenuItem>
          <Submenu
            open={open4}
            onOpenChange={setOpen4}
            animated={animated}
            disabled
          >
            <Menu.MenuItem
              className={itemClass()}
              onSelect={() => window.alert("one")}
            >
              One
            </Menu.MenuItem>
            <Menu.MenuItem
              className={itemClass()}
              onSelect={() => window.alert("two")}
            >
              Two
            </Menu.MenuItem>
            <Menu.MenuItem
              className={itemClass()}
              onSelect={() => window.alert("three")}
            >
              Three
            </Menu.MenuItem>
          </Submenu>
          <Menu.MenuItem
            className={itemClass()}
            onSelect={() => window.alert("three")}
          >
            Three
          </Menu.MenuItem>
        </Submenu>

        <Menu.MenuSeparator className={separatorClass()} />
        <Menu.MenuItem
          className={itemClass()}
          disabled
          onSelect={() => window.alert("cut")}
        >
          Cut
        </Menu.MenuItem>
        <Menu.MenuItem
          className={itemClass()}
          onSelect={() => window.alert("copy")}
        >
          Copy
        </Menu.MenuItem>
        <Menu.MenuItem
          className={itemClass()}
          onSelect={() => window.alert("paste")}
        >
          Paste
        </Menu.MenuItem>
      </MenuWithAnchor>
    </DirectionProvider>
  );
};

export const WithLabels = () => (
  <MenuWithAnchor>
    {foodGroups.map((foodGroup, index) => (
      <Menu.MenuGroup key={index}>
        {foodGroup.label && (
          <Menu.MenuLabel
            className={labelClass()}
            key={foodGroup.label}
          >
            {foodGroup.label}
          </Menu.MenuLabel>
        )}
        {foodGroup.foods.map((food) => (
          <Menu.MenuItem
            key={food.value}
            className={itemClass()}
            disabled={food.disabled}
            onSelect={() => window.alert(food.label)}
          >
            {food.label}
          </Menu.MenuItem>
        ))}
        {index < foodGroups.length - 1 && (
          <Menu.MenuSeparator className={separatorClass()} />
        )}
      </Menu.MenuGroup>
    ))}
  </MenuWithAnchor>
);

const suits = [
  { emoji: "♥️", label: "Hearts" },
  { emoji: "♠️", label: "Spades" },
  { emoji: "♦️", label: "Diamonds" },
  { emoji: "♣️", label: "Clubs" },
];

export const Typeahead = () => (
  <>
    <h1>Testing ground for typeahead behaviour</h1>

    <div
      style={{ display: "flex", alignItems: "flex-start", gap: 100 }}
    >
      <div>
        <h2>Text labels</h2>
        <div style={{ marginBottom: 20 }}>
          <p>
            For comparison
            <br />
            try the closed select below
          </p>
          <select>
            {foodGroups.map((foodGroup, index) => (
              <React.Fragment key={index}>
                {foodGroup.foods.map((food) => (
                  <option
                    key={food.value}
                    value={food.value}
                    disabled={food.disabled}
                  >
                    {food.label}
                  </option>
                ))}
              </React.Fragment>
            ))}
          </select>
        </div>
        <WithLabels />
      </div>

      <div>
        <h2>Complex children</h2>
        <p>(relying on `.textContent` — default)</p>
        <MenuWithAnchor>
          {suits.map((suit) => (
            <Menu.MenuItem key={suit.emoji} className={itemClass()}>
              {suit.label}
              <span role="img" aria-label={suit.label}>
                {suit.emoji}
              </span>
            </Menu.MenuItem>
          ))}
        </MenuWithAnchor>
      </div>

      <div>
        <h2>Complex children</h2>
        <p>(with explicit `textValue` prop)</p>
        <MenuWithAnchor>
          {suits.map((suit) => (
            <Menu.MenuItem
              key={suit.emoji}
              className={itemClass()}
              textValue={suit.label}
            >
              <span role="img" aria-label={suit.label}>
                {suit.emoji}
              </span>
              {suit.label}
            </Menu.MenuItem>
          ))}
        </MenuWithAnchor>
      </div>
    </div>
  </>
);

export const CheckboxItems = () => {
  const options = ["Crows", "Ravens", "Magpies", "Jackdaws"];

  const [selection, setSelection] = React.useState<string[]>([]);

  const handleSelectAll = () => {
    setSelection((currentSelection) =>
      currentSelection.length === options.length ? [] : options
    );
  };

  return (
    <MenuWithAnchor>
      <Menu.MenuCheckboxItem
        className={itemClass()}
        checked={
          selection.length === options.length
            ? true
            : selection.length
              ? "indeterminate"
              : false
        }
        onCheckedChange={handleSelectAll}
      >
        Select all
        <Menu.MenuItemIndicator>
          {selection.length === options.length ? <TickIcon /> : "—"}
        </Menu.MenuItemIndicator>
      </Menu.MenuCheckboxItem>
      <Menu.MenuSeparator className={separatorClass()} />
      {options.map((option) => (
        <Menu.MenuCheckboxItem
          key={option}
          className={itemClass()}
          checked={selection.includes(option)}
          onCheckedChange={() =>
            setSelection((current) =>
              current.includes(option)
                ? current.filter((el) => el !== option)
                : current.concat(option)
            )
          }
        >
          {option}
          <Menu.MenuItemIndicator>
            <TickIcon />
          </Menu.MenuItemIndicator>
        </Menu.MenuCheckboxItem>
      ))}
    </MenuWithAnchor>
  );
};

export const RadioItems = () => {
  const files = ["README.md", "index.js", "page.css"];
  const [file, setFile] = React.useState(files[1]);

  return (
    <MenuWithAnchor>
      <Menu.MenuItem
        className={itemClass()}
        onSelect={() => window.alert("minimize")}
      >
        Minimize window
      </Menu.MenuItem>
      <Menu.MenuItem
        className={itemClass()}
        onSelect={() => window.alert("zoom")}
      >
        Zoom
      </Menu.MenuItem>
      <Menu.MenuItem
        className={itemClass()}
        onSelect={() => window.alert("smaller")}
      >
        Smaller
      </Menu.MenuItem>
      <Menu.MenuSeparator className={separatorClass()} />
      <Menu.MenuRadioGroup value={file} onValueChange={setFile}>
        {files.map((file) => (
          <Menu.MenuRadioItem
            key={file}
            className={itemClass()}
            value={file}
          >
            {file}
            <Menu.MenuItemIndicator>
              <TickIcon />
            </Menu.MenuItemIndicator>
          </Menu.MenuRadioItem>
        ))}
      </Menu.MenuRadioGroup>
    </MenuWithAnchor>
  );
};

export const Animated = () => {
  const files = ["README.md", "index.js", "page.css"];
  const [file, setFile] = React.useState(files[1]);
  const [open, setOpen] = React.useState(true);
  const checkboxItems = [
    { label: "Bold", state: React.useState(false) },
    { label: "Italic", state: React.useState(true) },
    { label: "Underline", state: React.useState(false) },
    {
      label: "Strikethrough",
      state: React.useState(false),
      disabled: true,
    },
  ];

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={open}
          onChange={(event) => setOpen(event.target.checked)}
        />{" "}
        open
      </label>
      <br />
      <br />
      <MenuWithAnchor className={animatedContentClass()} open={open}>
        {checkboxItems.map(
          ({ label, state: [checked, setChecked], disabled }) => (
            <Menu.MenuCheckboxItem
              key={label}
              className={itemClass()}
              checked={checked}
              onCheckedChange={setChecked}
              disabled={disabled}
            >
              {label}
              <Menu.MenuItemIndicator
                className={animatedItemIndicatorClass()}
              >
                <TickIcon />
              </Menu.MenuItemIndicator>
            </Menu.MenuCheckboxItem>
          )
        )}
        <Menu.MenuRadioGroup value={file} onValueChange={setFile}>
          {files.map((file) => (
            <Menu.MenuRadioItem
              key={file}
              className={itemClass()}
              value={file}
            >
              {file}
              <Menu.MenuItemIndicator
                className={animatedItemIndicatorClass()}
              >
                <TickIcon />
              </Menu.MenuItemIndicator>
            </Menu.MenuRadioItem>
          ))}
        </Menu.MenuRadioGroup>
      </MenuWithAnchor>
    </>
  );
};

type MenuProps = Omit<
  React.ComponentProps<typeof Menu.Menu> &
    React.ComponentProps<typeof Menu.MenuContent>,
  | "trapFocus"
  | "onCloseAutoFocus"
  | "disableOutsidePointerEvents"
  | "disableOutsideScroll"
>;

const MenuWithAnchor: React.FC<MenuProps> = (props) => {
  const { open = true, children, ...contentProps } = props;
  return (
    <Menu.Menu open={open} onOpenChange={() => {}} modal={false}>
      {/* inline-block allows anchor to move when rtl changes on document */}
      <Menu.MenuAnchor style={{ display: "inline-block" }} />
      <Menu.MenuPortal>
        <Menu.MenuContent
          className={contentClass()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          align="start"
          {...contentProps}
        >
          {children}
        </Menu.MenuContent>
      </Menu.MenuPortal>
    </Menu.Menu>
  );
};

const Submenu: React.FC<
  MenuProps & {
    animated: boolean;
    disabled?: boolean;
    heading?: string;
  }
> = (props) => {
  const {
    heading = "Submenu",
    open = true,
    onOpenChange,
    children,
    animated,
    disabled,
    ...contentProps
  } = props;
  return (
    <Menu.MenuSub open={open} onOpenChange={onOpenChange}>
      <Menu.MenuSubTrigger
        className={subTriggerClass()}
        disabled={disabled}
      >
        {heading} →
      </Menu.MenuSubTrigger>
      <Menu.MenuPortal>
        <Menu.MenuSubContent
          className={
            animated ? animatedContentClass() : contentClass()
          }
          {...contentProps}
        >
          {children}
        </Menu.MenuSubContent>
      </Menu.MenuPortal>
    </Menu.MenuSub>
  );
};

const contentClass = css({
  display: "inline-block",
  boxSizing: "border-box",
  minWidth: 130,
  backgroundColor: "$white",
  border: "1px solid $gray100",
  borderRadius: 6,
  padding: 5,
  boxShadow: "0 5px 10px 0 rgba(0, 0, 0, 0.1)",
  fontFamily:
    "apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif",
  fontSize: 13,
  "&:focus-within": {
    borderColor: "$black",
  },
});

const itemStyles: any = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  lineHeight: "1",
  cursor: "default",
  userSelect: "none",
  whiteSpace: "nowrap",
  height: 25,
  padding: "0 10px",
  color: "$black",
  borderRadius: 3,
};

const labelClass = css({
  ...itemStyles,
  color: "$gray100",
});

const itemClass = css({
  ...itemStyles,
  outline: "none",

  "&[data-highlighted]": {
    backgroundColor: "$black",
    color: "white",
  },

  "&[data-disabled]": {
    color: "$gray100",
  },
});

const subTriggerClass = css(itemClass, {
  '&:not([data-highlighted])[data-state="open"]': {
    backgroundColor: "$gray100",
    color: "$black",
  },
});

const separatorClass = css({
  height: 1,
  margin: "5px 10px",
  backgroundColor: "$gray100",
});

const animateIn = keyframes({
  from: { transform: "scale(0.95)", opacity: 0 },
  to: { transform: "scale(1)", opacity: 1 },
});

const animateOut = keyframes({
  from: { transform: "scale(1)", opacity: 1 },
  to: { transform: "scale(0.95)", opacity: 0 },
});

const animatedContentClass = css(contentClass, {
  '&[data-state="open"]': {
    animation: `${animateIn} 300ms ease`,
  },
  '&[data-state="closed"]': {
    animation: `${animateOut} 300ms ease`,
  },
});

const animatedItemIndicatorClass = css({
  '&[data-state="checked"]': {
    animation: `${animateIn} 300ms ease`,
  },
  '&[data-state="unchecked"]': {
    animation: `${animateOut} 300ms ease`,
  },
});

export const TickIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="12"
    height="12"
    fill="none"
    stroke="currentcolor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="3"
  >
    <title>TickIcon</title>
    <path d="M2 20 L12 28 30 4" />
  </svg>
);

export const classes = {
  contentClass,
  labelClass,
  itemClass,
  separatorClass,
  subTriggerClass,
};
