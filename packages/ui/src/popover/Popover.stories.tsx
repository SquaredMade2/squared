;

import * as PopoverPrimitive from "../popover";
import { ALIGN_OPTIONS, SIDE_OPTIONS } from "../popper";

import { css, keyframes } from "../../stitches.config";
import { useRef, useState } from "react";

export default { title: "Components/Popover" };

export const Styled = () => {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "200vh",
			}}
		>
			<PopoverPrimitive.Popover>
				<PopoverPrimitive.Trigger className={triggerClass()}>
					open
				</PopoverPrimitive.Trigger>
				<PopoverPrimitive.Portal>
					<PopoverPrimitive.Content className={contentClass()} sideOffset={5}>
						<PopoverPrimitive.Close className={closeClass()}>
							close
						</PopoverPrimitive.Close>
						<PopoverPrimitive.Arrow
							className={arrowClass()}
							width={20}
							height={10}
						/>
					</PopoverPrimitive.Content>
				</PopoverPrimitive.Portal>
			</PopoverPrimitive.Popover>
			<input />
		</div>
	);
};

// Original issue: https://github.com/THEjacob1000/squared-ui/issues/2128
export const Boundary = () => {
	const [boundary, setBoundary] = useState<HTMLDivElement | null>(null);

	return (
		<div
			style={{
				border: "3px dashed red",
				width: "200px",
				height: "200px",
			}}
			ref={setBoundary}
		>
			<PopoverPrimitive.Popover>
				<PopoverPrimitive.Trigger asChild>
					<button>open</button>
				</PopoverPrimitive.Trigger>
				<PopoverPrimitive.Portal>
					<PopoverPrimitive.Content
						style={{
							boxSizing: "border-box",
							borderRadius: "8px",
							padding: "8px",
							color: "white",
							backgroundColor: "black",
							width: "var(--squared-popper-available-width)",
							height: "var(--squared-popper-available-height)",
						}}
						sideOffset={5}
						collisionBoundary={boundary}
					>
						out of bound out of bound out of bound out of bound out of bound out
						of bound out of bound out of bound out of bound
					</PopoverPrimitive.Content>
				</PopoverPrimitive.Portal>
			</PopoverPrimitive.Popover>
		</div>
	);
};

export const Modality = () => {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "110vh",
			}}
		>
			<div style={{ display: "grid", gap: 50 }}>
				<div
					style={{
						display: "inline-flex",
						alignItems: "center",
						flexDirection: "column",
					}}
				>
					<h1>Non modal (default)</h1>
					<PopoverPrimitive.Popover>
						<PopoverPrimitive.Trigger className={triggerClass()}>
							open
						</PopoverPrimitive.Trigger>
						<PopoverPrimitive.Portal>
							<PopoverPrimitive.Content
								className={contentClass()}
								sideOffset={5}
							>
								<PopoverPrimitive.Close className={closeClass()}>
									close
								</PopoverPrimitive.Close>
								<PopoverPrimitive.Arrow
									className={arrowClass()}
									width={20}
									height={10}
									offset={10}
								/>
							</PopoverPrimitive.Content>
						</PopoverPrimitive.Portal>
					</PopoverPrimitive.Popover>
					<textarea
						style={{ width: 500, height: 100, marginTop: 10 }}
						defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet."
					/>
				</div>
				<div
					style={{
						display: "inline-flex",
						alignItems: "center",
						flexDirection: "column",
					}}
				>
					<h1>Modal</h1>
					<PopoverPrimitive.Popover modal>
						<PopoverPrimitive.Trigger className={triggerClass()}>
							open
						</PopoverPrimitive.Trigger>
						<PopoverPrimitive.Portal>
							<PopoverPrimitive.Content
								className={contentClass()}
								sideOffset={5}
							>
								<PopoverPrimitive.Close className={closeClass()}>
									close
								</PopoverPrimitive.Close>
								<PopoverPrimitive.Arrow
									className={arrowClass()}
									width={20}
									height={10}
									offset={10}
								/>
							</PopoverPrimitive.Content>
						</PopoverPrimitive.Portal>
					</PopoverPrimitive.Popover>
					<textarea
						style={{ width: 500, height: 100, marginTop: 10 }}
						defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet."
					/>
				</div>
			</div>
		</div>
	);
};

export const Controlled = () => {
	const [open, setOpen] = useState(false);
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "50vh",
			}}
		>
			<PopoverPrimitive.Popover open={open} onOpenChange={setOpen}>
				<PopoverPrimitive.Trigger className={triggerClass()}>
					{open ? "close" : "open"}
				</PopoverPrimitive.Trigger>
				<PopoverPrimitive.Portal>
					<PopoverPrimitive.Content className={contentClass()}>
						<PopoverPrimitive.Close className={closeClass()}>
							close
						</PopoverPrimitive.Close>
						<PopoverPrimitive.Arrow
							className={arrowClass()}
							width={20}
							height={10}
						/>
					</PopoverPrimitive.Content>
				</PopoverPrimitive.Portal>
			</PopoverPrimitive.Popover>
		</div>
	);
};

export const Animated = () => {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "200vh",
			}}
		>
			<PopoverPrimitive.Popover>
				<PopoverPrimitive.Trigger className={triggerClass()}>
					open
				</PopoverPrimitive.Trigger>
				<PopoverPrimitive.Portal>
					<PopoverPrimitive.Content
						className={animatedContentClass()}
						sideOffset={10}
					>
						<PopoverPrimitive.Close className={closeClass()}>
							close
						</PopoverPrimitive.Close>
						<PopoverPrimitive.Arrow
							className={arrowClass()}
							width={20}
							height={10}
						/>
					</PopoverPrimitive.Content>
				</PopoverPrimitive.Portal>
			</PopoverPrimitive.Popover>
		</div>
	);
};

export const ForcedMount = () => {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "200vh",
			}}
		>
			<PopoverPrimitive.Popover>
				<PopoverPrimitive.Trigger className={triggerClass()}>
					open
				</PopoverPrimitive.Trigger>
				<PopoverPrimitive.Portal forceMount>
					<PopoverPrimitive.Content className={contentClass()} sideOffset={10}>
						<PopoverPrimitive.Close className={closeClass()}>
							close
						</PopoverPrimitive.Close>
						<PopoverPrimitive.Arrow
							className={arrowClass()}
							width={20}
							height={10}
						/>
					</PopoverPrimitive.Content>
				</PopoverPrimitive.Portal>
			</PopoverPrimitive.Popover>
		</div>
	);
};

export const Nested = () => {
	const buttonRef = useRef<HTMLButtonElement>(null);

	return (
		<div
			style={{
				height: "300vh",
				width: "300vw",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<button
				type="button"
				style={{ position: "fixed", top: 10, left: 10 }}
				onClick={() => buttonRef.current?.focus()}
			>
				Focus popover button
			</button>

			<PopoverPrimitive.Popover>
				<PopoverPrimitive.Trigger className={triggerClass()} ref={buttonRef}>
					Open popover
				</PopoverPrimitive.Trigger>

				<PopoverPrimitive.Portal>
					<PopoverPrimitive.Content
						className={contentClass()}
						sideOffset={5}
						style={{ backgroundColor: "crimson" }}
					>
						<PopoverPrimitive.Popover>
							<PopoverPrimitive.Trigger className={triggerClass()}>
								Open nested popover
							</PopoverPrimitive.Trigger>
							<PopoverPrimitive.Portal>
								<PopoverPrimitive.Content
									className={contentClass()}
									side="top"
									align="center"
									sideOffset={5}
									style={{ backgroundColor: "green" }}
								>
									<PopoverPrimitive.Close className={closeClass()}>
										close
									</PopoverPrimitive.Close>
									<PopoverPrimitive.Arrow
										className={arrowClass()}
										width={20}
										height={10}
										offset={20}
										style={{ fill: "green" }}
									/>
								</PopoverPrimitive.Content>
							</PopoverPrimitive.Portal>
						</PopoverPrimitive.Popover>

						<PopoverPrimitive.Close
							className={closeClass()}
							style={{ marginLeft: 10 }}
						>
							close
						</PopoverPrimitive.Close>
						<PopoverPrimitive.Arrow
							className={arrowClass()}
							width={20}
							height={10}
							offset={20}
							style={{ fill: "crimson" }}
						/>
					</PopoverPrimitive.Content>
				</PopoverPrimitive.Portal>
			</PopoverPrimitive.Popover>
		</div>
	);
};

export const CustomAnchor = () => (
	<PopoverPrimitive.Popover>
		<PopoverPrimitive.Anchor
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				width: 250,
				padding: 20,
				margin: 100,
				backgroundColor: "#eee",
			}}
		>
			Item{" "}
			<PopoverPrimitive.Trigger className={triggerClass()}>
				open
			</PopoverPrimitive.Trigger>
		</PopoverPrimitive.Anchor>
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content
				className={contentClass()}
				side="right"
				sideOffset={1}
				align="start"
				style={{ borderRadius: 0, width: 200, height: 100 }}
			>
				<PopoverPrimitive.Close>close</PopoverPrimitive.Close>
			</PopoverPrimitive.Content>
		</PopoverPrimitive.Portal>
	</PopoverPrimitive.Popover>
);

export const WithSlottedTrigger = () => {
	return (
		<PopoverPrimitive.Popover>
			<PopoverPrimitive.Trigger asChild>
				<button
					className={triggerClass()}
					onClick={() => console.log("StyledTrigger click")}
				>
					open
				</button>
			</PopoverPrimitive.Trigger>
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content className={contentClass()} sideOffset={5}>
					<PopoverPrimitive.Close className={closeClass()}>
						close
					</PopoverPrimitive.Close>
					<PopoverPrimitive.Arrow
						className={arrowClass()}
						width={20}
						height={10}
						offset={10}
					/>
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Popover>
	);
};

// change order slightly for more pleasing visual
type Side = "top" | "right" | "left" | "bottom";
const filteredSides: Side[] = SIDE_OPTIONS.filter((side) => side !== "bottom");
filteredSides.push("bottom");
const SIDES = filteredSides;

export const Chromatic = () => (
	<div style={{ padding: 200, paddingBottom: 500 }}>
		<h1>Uncontrolled</h1>
		<h2>Closed</h2>
		<PopoverPrimitive.Popover>
			<PopoverPrimitive.Trigger className={triggerClass()}>
				open
			</PopoverPrimitive.Trigger>
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content className={contentClass()} sideOffset={5}>
					<PopoverPrimitive.Close className={closeClass()}>
						close
					</PopoverPrimitive.Close>
					<PopoverPrimitive.Arrow
						className={arrowClass()}
						width={20}
						height={10}
					/>
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Popover>

		<h2>Open</h2>
		<PopoverPrimitive.Popover defaultOpen>
			<PopoverPrimitive.Trigger className={triggerClass()}>
				open
			</PopoverPrimitive.Trigger>
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content
					className={contentClass()}
					sideOffset={5}
					onFocusOutside={(event) => event.preventDefault()}
				>
					<PopoverPrimitive.Close className={closeClass()}>
						close
					</PopoverPrimitive.Close>
					<PopoverPrimitive.Arrow
						className={arrowClass()}
						width={20}
						height={10}
					/>
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Popover>

		<h2 style={{ marginTop: 100 }}>Open with reordered parts</h2>
		<PopoverPrimitive.Popover defaultOpen>
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content
					className={contentClass()}
					sideOffset={5}
					onFocusOutside={(event) => event.preventDefault()}
				>
					<PopoverPrimitive.Close className={closeClass()}>
						close
					</PopoverPrimitive.Close>
					<PopoverPrimitive.Arrow
						className={arrowClass()}
						width={20}
						height={10}
					/>
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
			<PopoverPrimitive.Trigger className={triggerClass()}>
				open
			</PopoverPrimitive.Trigger>
		</PopoverPrimitive.Popover>

		<h1 style={{ marginTop: 100 }}>Controlled</h1>
		<h2>Closed</h2>
		<PopoverPrimitive.Popover open={false}>
			<PopoverPrimitive.Trigger className={triggerClass()}>
				open
			</PopoverPrimitive.Trigger>
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content className={contentClass()} sideOffset={5}>
					<PopoverPrimitive.Close className={closeClass()}>
						close
					</PopoverPrimitive.Close>
					<PopoverPrimitive.Arrow
						className={arrowClass()}
						width={20}
						height={10}
					/>
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Popover>

		<h2>Open</h2>
		<PopoverPrimitive.Popover open>
			<PopoverPrimitive.Trigger className={triggerClass()}>
				open
			</PopoverPrimitive.Trigger>
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content className={contentClass()} sideOffset={5}>
					<PopoverPrimitive.Close className={closeClass()}>
						close
					</PopoverPrimitive.Close>
					<PopoverPrimitive.Arrow
						className={arrowClass()}
						width={20}
						height={10}
					/>
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Popover>

		<h2 style={{ marginTop: 100 }}>Open with reordered parts</h2>
		<PopoverPrimitive.Popover open>
			<PopoverPrimitive.Content className={contentClass()} sideOffset={5}>
				<PopoverPrimitive.Close className={closeClass()}>
					close
				</PopoverPrimitive.Close>
				<PopoverPrimitive.Arrow
					className={arrowClass()}
					width={20}
					height={10}
				/>
			</PopoverPrimitive.Content>
			<PopoverPrimitive.Trigger className={triggerClass()}>
				open
			</PopoverPrimitive.Trigger>
		</PopoverPrimitive.Popover>

		<h1 style={{ marginTop: 100 }}>Force mounted content</h1>
		<PopoverPrimitive.Popover>
			<PopoverPrimitive.Trigger className={triggerClass()}>
				open
			</PopoverPrimitive.Trigger>
			<PopoverPrimitive.Portal forceMount>
				<PopoverPrimitive.Content className={contentClass()} sideOffset={5}>
					<PopoverPrimitive.Close className={closeClass()}>
						close
					</PopoverPrimitive.Close>
					<PopoverPrimitive.Arrow
						className={arrowClass()}
						width={20}
						height={10}
					/>
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Popover>

		<h1 style={{ marginTop: 100 }}>Anchor</h1>
		<h2>Controlled</h2>
		<PopoverPrimitive.Popover open>
			<PopoverPrimitive.Anchor style={{ padding: 20, background: "gainsboro" }}>
				<PopoverPrimitive.Trigger className={triggerClass()}>
					open
				</PopoverPrimitive.Trigger>
			</PopoverPrimitive.Anchor>
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content className={contentClass()}>
					<PopoverPrimitive.Close className={closeClass()}>
						close
					</PopoverPrimitive.Close>
					<PopoverPrimitive.Arrow
						className={arrowClass()}
						width={20}
						height={10}
					/>
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Popover>

		<h2>Uncontrolled</h2>
		<PopoverPrimitive.Popover defaultOpen>
			<PopoverPrimitive.Anchor style={{ padding: 20, background: "gainsboro" }}>
				<PopoverPrimitive.Trigger className={triggerClass()}>
					open
				</PopoverPrimitive.Trigger>
			</PopoverPrimitive.Anchor>
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content
					className={contentClass()}
					onFocusOutside={(event) => event.preventDefault()}
				>
					<PopoverPrimitive.Close className={closeClass()}>
						close
					</PopoverPrimitive.Close>
					<PopoverPrimitive.Arrow
						className={arrowClass()}
						width={20}
						height={10}
					/>
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Popover>

		<h1 style={{ marginTop: 100 }}>Positioning</h1>
		<h2>No collisions</h2>
		<h3>Side & Align</h3>
		<div className={gridClass()}>
			{SIDES.map((side) =>
				ALIGN_OPTIONS.map((align) => (
					<PopoverPrimitive.Popover key={`${side}-${align}`} open>
						<PopoverPrimitive.Trigger className={chromaticTriggerClass()} />
						<PopoverPrimitive.Portal>
							<PopoverPrimitive.Content
								className={chromaticContentClass()}
								side={side}
								align={align}
								avoidCollisions={false}
							>
								<p style={{ textAlign: "center" }}>
									{side}
									<br />
									{align}
								</p>
								<PopoverPrimitive.Arrow
									className={chromaticArrowClass()}
									width={20}
									height={10}
								/>
							</PopoverPrimitive.Content>
						</PopoverPrimitive.Portal>
					</PopoverPrimitive.Popover>
				)),
			)}
		</div>

		<h3>Side offset</h3>
		<h4>Positive</h4>
		<div className={gridClass()}>
			{SIDES.map((side) =>
				ALIGN_OPTIONS.map((align) => (
					<PopoverPrimitive.Popover key={`${side}-${align}`} open>
						<PopoverPrimitive.Trigger className={chromaticTriggerClass()} />
						<PopoverPrimitive.Portal>
							<PopoverPrimitive.Content
								className={chromaticContentClass()}
								side={side}
								sideOffset={5}
								align={align}
								avoidCollisions={false}
							>
								<p style={{ textAlign: "center" }}>
									{side}
									<br />
									{align}
								</p>
								<PopoverPrimitive.Arrow
									className={chromaticArrowClass()}
									width={20}
									height={10}
								/>
							</PopoverPrimitive.Content>
						</PopoverPrimitive.Portal>
					</PopoverPrimitive.Popover>
				)),
			)}
		</div>
		<h4>Negative</h4>
		<div className={gridClass()}>
			{SIDES.map((side) =>
				ALIGN_OPTIONS.map((align) => (
					<PopoverPrimitive.Popover key={`${side}-${align}`} open>
						<PopoverPrimitive.Trigger className={chromaticTriggerClass()} />
						<PopoverPrimitive.Portal>
							<PopoverPrimitive.Content
								className={chromaticContentClass()}
								side={side}
								sideOffset={-10}
								align={align}
								avoidCollisions={false}
							>
								<p style={{ textAlign: "center" }}>
									{side}
									<br />
									{align}
								</p>
								<PopoverPrimitive.Arrow
									className={chromaticArrowClass()}
									width={20}
									height={10}
								/>
							</PopoverPrimitive.Content>
						</PopoverPrimitive.Portal>
					</PopoverPrimitive.Popover>
				)),
			)}
		</div>

		<h3>Align offset</h3>
		<h4>Positive</h4>
		<div className={gridClass()}>
			{SIDES.map((side) =>
				ALIGN_OPTIONS.map((align) => (
					<PopoverPrimitive.Popover key={`${side}-${align}`} open>
						<PopoverPrimitive.Trigger className={chromaticTriggerClass()} />
						<PopoverPrimitive.Portal>
							<PopoverPrimitive.Content
								className={chromaticContentClass()}
								side={side}
								align={align}
								alignOffset={20}
								avoidCollisions={false}
							>
								<p style={{ textAlign: "center" }}>
									{side}
									<br />
									{align}
								</p>
								<PopoverPrimitive.Arrow
									className={chromaticArrowClass()}
									width={20}
									height={10}
								/>
							</PopoverPrimitive.Content>
						</PopoverPrimitive.Portal>
					</PopoverPrimitive.Popover>
				)),
			)}
		</div>
		<h4>Negative</h4>
		<div className={gridClass()}>
			{SIDES.map((side) =>
				ALIGN_OPTIONS.map((align) => (
					<PopoverPrimitive.Popover key={`${side}-${align}`} open>
						<PopoverPrimitive.Trigger className={chromaticTriggerClass()} />
						<PopoverPrimitive.Portal>
							<PopoverPrimitive.Content
								className={chromaticContentClass()}
								side={side}
								align={align}
								alignOffset={-10}
								avoidCollisions={false}
							>
								<p style={{ textAlign: "center" }}>
									{side}
									<br />
									{align}
								</p>
								<PopoverPrimitive.Arrow
									className={chromaticArrowClass()}
									width={20}
									height={10}
								/>
							</PopoverPrimitive.Content>
						</PopoverPrimitive.Portal>
					</PopoverPrimitive.Popover>
				)),
			)}
		</div>

		<h2>Collisions</h2>
		<p>See instances on the periphery of the page.</p>
		{SIDES.map((side) =>
			ALIGN_OPTIONS.map((align) => (
				<PopoverPrimitive.Popover key={`${side}-${align}`} open>
					<PopoverPrimitive.Trigger
						className={chromaticTriggerClass()}
						style={{
							position: "absolute",
							[side]: 10,
							...((side === "right" || side === "left") &&
								(align === "start"
									? { bottom: 10 }
									: align === "center"
										? { top: "calc(50% - 15px)" }
										: { top: 10 })),
							...((side === "top" || side === "bottom") &&
								(align === "start"
									? { right: 10 }
									: align === "center"
										? { left: "calc(50% - 15px)" }
										: { left: 10 })),
						}}
					/>
					<PopoverPrimitive.Portal>
						<PopoverPrimitive.Content
							className={chromaticContentClass()}
							side={side}
							align={align}
						>
							<p style={{ textAlign: "center" }}>
								{side}
								<br />
								{align}
							</p>
							<PopoverPrimitive.Arrow
								className={chromaticArrowClass()}
								width={20}
								height={10}
							/>
						</PopoverPrimitive.Content>
					</PopoverPrimitive.Portal>
				</PopoverPrimitive.Popover>
			)),
		)}

		<h2>Relative parent (non-portalled)</h2>
		<div style={{ position: "relative" }}>
			<PopoverPrimitive.Popover open>
				<PopoverPrimitive.Trigger asChild>
					<button className={triggerClass()}>open</button>
				</PopoverPrimitive.Trigger>
				<PopoverPrimitive.Content className={contentClass()} sideOffset={5}>
					<PopoverPrimitive.Close className={closeClass()}>
						close
					</PopoverPrimitive.Close>
					<PopoverPrimitive.Arrow
						className={arrowClass()}
						width={20}
						height={10}
						offset={10}
					/>
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Popover>
		</div>

		<h1 style={{ marginTop: 100 }}>With slotted trigger</h1>
		<PopoverPrimitive.Popover open>
			<PopoverPrimitive.Trigger asChild>
				<button className={triggerClass()}>open</button>
			</PopoverPrimitive.Trigger>
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content className={contentClass()} sideOffset={5}>
					<PopoverPrimitive.Close className={closeClass()}>
						close
					</PopoverPrimitive.Close>
					<PopoverPrimitive.Arrow
						className={arrowClass()}
						width={20}
						height={10}
						offset={10}
					/>
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Popover>

		<h1 style={{ marginTop: 100 }}>State attributes</h1>
		<h2>Closed</h2>
		<PopoverPrimitive.Popover open={false}>
			<PopoverPrimitive.Trigger className={triggerAttrClass()}>
				open
			</PopoverPrimitive.Trigger>
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content
					className={contentAttrClass()}
					sideOffset={5}
					avoidCollisions={false}
				>
					<PopoverPrimitive.Close className={closeAttrClass()}>
						close
					</PopoverPrimitive.Close>
					<PopoverPrimitive.Arrow
						className={arrowAttrClass()}
						width={20}
						height={10}
					/>
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Popover>

		<h2>Open</h2>
		<PopoverPrimitive.Popover open>
			<PopoverPrimitive.Trigger className={triggerAttrClass()}>
				open
			</PopoverPrimitive.Trigger>
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content
					className={contentAttrClass()}
					side="right"
					sideOffset={5}
					avoidCollisions={false}
				>
					<PopoverPrimitive.Close className={closeAttrClass()}>
						close
					</PopoverPrimitive.Close>
					<PopoverPrimitive.Arrow
						className={arrowAttrClass()}
						width={20}
						height={10}
					/>
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Popover>
	</div>
);
Chromatic.parameters = { chromatic: { disable: false } };

const triggerClass = css({});

const RECOMMENDED_CSS__POPOVER__CONTENT = {
	transformOrigin: "var(--squared-popover-content-transform-origin)",
};

const contentClass = css({
	...RECOMMENDED_CSS__POPOVER__CONTENT,
	backgroundColor: "$gray300",
	padding: 20,
	borderRadius: 5,
});

const closeClass = css({});

const arrowClass = css({
	fill: "$gray300",
});

const fadeIn = keyframes({
	from: { opacity: 0 },
	to: { opacity: 1 },
});

const fadeOut = keyframes({
	from: { opacity: 1 },
	to: { opacity: 0 },
});

const animatedContentClass = css(contentClass, {
	'&[data-state="open"]': {
		animation: `${fadeIn} 300ms ease-out`,
	},
	'&[data-state="closed"]': {
		animation: `${fadeOut} 300ms ease-in`,
	},
});

const gridClass = css({
	display: "inline-grid",
	gridTemplateColumns: "repeat(3, 50px)",
	columnGap: 150,
	rowGap: 100,
	padding: 100,
	border: "1px solid black",
});

const chromaticTriggerClass = css({
	boxSizing: "border-box",
	width: 30,
	height: 30,
	backgroundColor: "tomato",
	border: "1px solid rgba(0, 0, 0, 0.3)",
});
const chromaticContentClass = css({
	boxSizing: "border-box",
	display: "grid",
	placeContent: "center",
	width: 60,
	height: 60,
	backgroundColor: "royalblue",
	color: "white",
	fontSize: 10,
	border: "1px solid rgba(0, 0, 0, 0.3)",
});
const chromaticArrowClass = css({
	fill: "black",
});

const styles = {
	backgroundColor: "rgba(0, 0, 255, 0.3)",
	border: "2px solid blue",
	padding: 10,

	'&[data-state="closed"]': { borderColor: "red" },
	'&[data-state="open"]': { borderColor: "green" },
};
const triggerAttrClass = css(styles);
const contentAttrClass = css(chromaticContentClass, styles);
const arrowAttrClass = css(styles);
const closeAttrClass = css(styles);
