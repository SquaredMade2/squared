import * as React from "react";
import { css, keyframes } from "../../stitches.config";
import { SIDE_OPTIONS, ALIGN_OPTIONS } from "../popper";
import * as DialogPrimitive from "../dialog";
import * as Tooltip from "../tooltip";

export default { title: "Components/Tooltip" };

export const Styled = () => (
	<Tooltip.TooltipProvider>
		<Tooltip.Tooltip>
			<Tooltip.TooltipTrigger className={triggerClass()}>
				Hover or Focus me
			</Tooltip.TooltipTrigger>
			<Tooltip.TooltipPortal>
				<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
					Nicely done!
					<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
				</Tooltip.TooltipContent>
			</Tooltip.TooltipPortal>
		</Tooltip.Tooltip>
	</Tooltip.TooltipProvider>
);

export const Controlled = () => {
	const [open, setOpen] = React.useState(true);
	return (
		<Tooltip.TooltipProvider>
			<Tooltip.Tooltip open={open} onOpenChange={setOpen}>
				<Tooltip.TooltipTrigger style={{ margin: 100 }}>
					I'm controlled, look I'm {open ? "open" : "closed"}
				</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						Nicely done!
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>
		</Tooltip.TooltipProvider>
	);
};

export const CustomDurations = () => (
	<Tooltip.TooltipProvider>
		<h1>Delay duration</h1>
		<h2>Default (700ms)</h2>

		<div style={{ display: "flex", gap: 50 }}>
			<Tooltip.Tooltip>
				<Tooltip.TooltipTrigger className={triggerClass()}>
					Hover me
				</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						Nicely done!
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>
			<Tooltip.Tooltip>
				<Tooltip.TooltipTrigger className={triggerClass()}>
					Hover me
				</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						Nicely done!
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>
			<Tooltip.Tooltip>
				<Tooltip.TooltipTrigger className={triggerClass()}>
					Hover me
				</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						Nicely done!
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>
		</div>

		<h2>Custom (0ms = instant open)</h2>
		<div style={{ display: "flex", gap: 50 }}>
			<Tooltip.TooltipProvider delayDuration={0}>
				<Tooltip.Tooltip>
					<Tooltip.TooltipTrigger className={triggerClass()}>
						Hover me
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipPortal>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.TooltipPortal>
				</Tooltip.Tooltip>
				<Tooltip.Tooltip>
					<Tooltip.TooltipTrigger className={triggerClass()}>
						Hover me
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipPortal>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.TooltipPortal>
				</Tooltip.Tooltip>
				<Tooltip.Tooltip>
					<Tooltip.TooltipTrigger className={triggerClass()}>
						Hover me
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipPortal>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.TooltipPortal>
				</Tooltip.Tooltip>
			</Tooltip.TooltipProvider>
		</div>

		<h2>Custom (2s)</h2>
		<div style={{ display: "flex", gap: 50 }}>
			<Tooltip.TooltipProvider delayDuration={2000}>
				<Tooltip.Tooltip>
					<Tooltip.TooltipTrigger className={triggerClass()}>
						Hover me
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipPortal>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.TooltipPortal>
				</Tooltip.Tooltip>
				<Tooltip.Tooltip>
					<Tooltip.TooltipTrigger className={triggerClass()}>
						Hover me
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipPortal>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.TooltipPortal>
				</Tooltip.Tooltip>
				<Tooltip.Tooltip>
					<Tooltip.TooltipTrigger className={triggerClass()}>
						Hover me
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipPortal>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.TooltipPortal>
				</Tooltip.Tooltip>
			</Tooltip.TooltipProvider>
		</div>

		<h1>Skip delay duration</h1>
		<h2>Default (300ms to move from one to another tooltip)</h2>
		<div style={{ display: "flex", gap: 50 }}>
			<Tooltip.Tooltip>
				<Tooltip.TooltipTrigger className={triggerClass()}>
					Hover me
				</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						Nicely done!
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>
			<Tooltip.Tooltip>
				<Tooltip.TooltipTrigger className={triggerClass()}>
					Hover me
				</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						Nicely done!
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>
			<Tooltip.Tooltip>
				<Tooltip.TooltipTrigger className={triggerClass()}>
					Hover me
				</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						Nicely done!
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>
		</div>

		<h2>Custom (0ms to move from one to another tooltip = never skip)</h2>
		<div style={{ display: "flex", gap: 50 }}>
			<Tooltip.TooltipProvider skipDelayDuration={0}>
				<Tooltip.Tooltip>
					<Tooltip.TooltipTrigger className={triggerClass()}>
						Hover me
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipPortal>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.TooltipPortal>
				</Tooltip.Tooltip>
				<Tooltip.Tooltip>
					<Tooltip.TooltipTrigger className={triggerClass()}>
						Hover me
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipPortal>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.TooltipPortal>
				</Tooltip.Tooltip>
				<Tooltip.Tooltip>
					<Tooltip.TooltipTrigger className={triggerClass()}>
						Hover me
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipPortal>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.TooltipPortal>
				</Tooltip.Tooltip>
			</Tooltip.TooltipProvider>
		</div>

		<h2>Custom (5s to move from one to another tooltip)</h2>
		<div style={{ display: "flex", gap: 50 }}>
			<Tooltip.TooltipProvider skipDelayDuration={5000}>
				<Tooltip.Tooltip>
					<Tooltip.TooltipTrigger className={triggerClass()}>
						Hover me
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipPortal>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.TooltipPortal>
				</Tooltip.Tooltip>
				<Tooltip.Tooltip>
					<Tooltip.TooltipTrigger className={triggerClass()}>
						Hover me
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipPortal>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.TooltipPortal>
				</Tooltip.Tooltip>
				<Tooltip.Tooltip>
					<Tooltip.TooltipTrigger className={triggerClass()}>
						Hover me
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipPortal>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.TooltipPortal>
				</Tooltip.Tooltip>
			</Tooltip.TooltipProvider>
		</div>
	</Tooltip.TooltipProvider>
);

export const CustomContent = () => (
	<Tooltip.TooltipProvider>
		<div style={{ display: "flex", gap: 20, padding: 100 }}>
			<Tooltip.Tooltip>
				<Tooltip.TooltipTrigger>Heading</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						<h1>Some heading</h1>
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>

			<Tooltip.Tooltip>
				<Tooltip.TooltipTrigger>Paragraph</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						<p>Some paragraph</p>
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>

			<Tooltip.Tooltip>
				<Tooltip.TooltipTrigger>List</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						<ul>
							<li>One</li>
							<li>Two</li>
							<li>Three</li>
						</ul>
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>

			<Tooltip.Tooltip>
				<Tooltip.TooltipTrigger>Article</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						<article>
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum,
							quae qui. Magnam delectus ex totam repellat amet distinctio unde,
							porro architecto voluptatibus nemo et nisi, voluptatem eligendi
							earum autem fugit.
						</article>
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>

			<Tooltip.Tooltip>
				<Tooltip.TooltipTrigger>Figure</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						<figure style={{ margin: 0 }}>
							<img
								src="https://pbs.twimg.com/profile_images/864164353771229187/Catw6Nmh_400x400.jpg"
								alt=""
								width={100}
							/>
							<figcaption>Colm Tuite</figcaption>
						</figure>
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>

			<Tooltip.Tooltip>
				<Tooltip.TooltipTrigger>Time</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						{/* @ts-ignore */}
						<time datetime="2017-10-31T11:21:00+02:00">
							Tuesday, 31 October 2017
						</time>
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>

			<Tooltip.Tooltip>
				<Tooltip.TooltipTrigger>Link</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						View in <a href="https://workos.com">WorkOS</a>
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>

			<Tooltip.Tooltip>
				<Tooltip.TooltipTrigger>Form</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						<form>
							<label htmlFor="fname">First name:</label>
							<br />
							<input type="text" id="fname" name="fname" />
							<br />
							<label htmlFor="lname">Last name:</label>
							<br />
							<input type="text" id="lname" name="lname" />
						</form>
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>

			<Tooltip.Tooltip>
				<Tooltip.TooltipTrigger>Mini layout</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						<p
							style={{
								margin: 0,
								textAlign: "center",
								fontFamily:
									"apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif",
								fontSize: 14,
							}}
						>
							Start video call
							<span style={{ display: "block", color: "#999" }}>
								press{" "}
								<kbd
									style={{
										fontFamily:
											"apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif",
										fontWeight: "bold",
										color: "white",
									}}
									aria-label="c key"
								>
									c
								</kbd>
							</span>
						</p>
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>
		</div>
	</Tooltip.TooltipProvider>
);

export const Positions = () => (
	<Tooltip.TooltipProvider>
		<div
			style={{
				display: "flex",
				width: "100vw",
				height: "100vh",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(5, 1fr)",
					gridTemplateRows: "repeat(5, 50px)",
				}}
			>
				<SimpleTooltip label="Top start" side="top" align="start">
					<Tooltip.TooltipTrigger
						className={positionButtonClass()}
						style={{ gridColumn: "2", gridRow: "1" }}
					>
						Top start
					</Tooltip.TooltipTrigger>
				</SimpleTooltip>
				<SimpleTooltip label="Top center" side="top" align="center">
					<Tooltip.TooltipTrigger
						className={positionButtonClass()}
						style={{ gridColumn: "3", gridRow: "1" }}
					>
						Top center
					</Tooltip.TooltipTrigger>
				</SimpleTooltip>
				<SimpleTooltip label="Top end" side="top" align="end">
					<Tooltip.TooltipTrigger
						className={positionButtonClass()}
						style={{ gridColumn: "4", gridRow: "1" }}
					>
						Top end
					</Tooltip.TooltipTrigger>
				</SimpleTooltip>

				<SimpleTooltip label="Right start" side="right" align="start">
					<Tooltip.TooltipTrigger
						className={positionButtonClass()}
						style={{ gridColumn: "5", gridRow: "2" }}
						tabIndex={0}
					>
						Right start
					</Tooltip.TooltipTrigger>
				</SimpleTooltip>
				<SimpleTooltip label="Right center" side="right" align="center">
					<Tooltip.TooltipTrigger
						className={positionButtonClass()}
						style={{ gridColumn: "5", gridRow: "3" }}
						tabIndex={0}
					>
						Right center
					</Tooltip.TooltipTrigger>
				</SimpleTooltip>
				<SimpleTooltip label="Right end" side="right" align="end">
					<Tooltip.TooltipTrigger
						className={positionButtonClass()}
						style={{ gridColumn: "5", gridRow: "4" }}
						tabIndex={0}
					>
						Right end
					</Tooltip.TooltipTrigger>
				</SimpleTooltip>

				<SimpleTooltip label="Bottom end" side="bottom" align="end">
					<Tooltip.TooltipTrigger
						className={positionButtonClass()}
						style={{ gridColumn: "4", gridRow: "5" }}
					>
						Bottom end
					</Tooltip.TooltipTrigger>
				</SimpleTooltip>
				<SimpleTooltip label="Bottom center" side="bottom" align="center">
					<Tooltip.TooltipTrigger
						className={positionButtonClass()}
						style={{ gridColumn: "3", gridRow: "5" }}
					>
						Bottom center
					</Tooltip.TooltipTrigger>
				</SimpleTooltip>
				<SimpleTooltip label="Bottom start" side="bottom" align="start">
					<Tooltip.TooltipTrigger
						className={positionButtonClass()}
						style={{ gridColumn: "2", gridRow: "5" }}
					>
						Bottom start
					</Tooltip.TooltipTrigger>
				</SimpleTooltip>

				<SimpleTooltip label="Left end" side="left" align="end">
					<Tooltip.TooltipTrigger
						className={positionButtonClass()}
						style={{ gridColumn: "1", gridRow: "4" }}
					>
						Left end
					</Tooltip.TooltipTrigger>
				</SimpleTooltip>
				<SimpleTooltip label="Left center" side="left" align="center">
					<Tooltip.TooltipTrigger
						className={positionButtonClass()}
						style={{ gridColumn: "1", gridRow: "3" }}
					>
						Left center
					</Tooltip.TooltipTrigger>
				</SimpleTooltip>
				<SimpleTooltip label="Left start" side="left" align="start">
					<Tooltip.TooltipTrigger
						className={positionButtonClass()}
						style={{ gridColumn: "1", gridRow: "2" }}
					>
						Left start
					</Tooltip.TooltipTrigger>
				</SimpleTooltip>
			</div>
		</div>
	</Tooltip.TooltipProvider>
);

export const AriaLabel = () => (
	<Tooltip.TooltipProvider>
		<p>The first button will display AND enunciate the label.</p>
		<p>
			The second button will display the label, but enunciate the aria label.
		</p>
		<div style={{ display: "flex" }}>
			<SimpleTooltip label="Notifications">
				<Tooltip.TooltipTrigger style={{ margin: 5 }}>
					<span aria-hidden>🔔(3)</span>
				</Tooltip.TooltipTrigger>
			</SimpleTooltip>

			<SimpleTooltip label="Notifications" aria-label="3 notifications">
				<Tooltip.TooltipTrigger style={{ margin: 5 }}>
					<span aria-hidden>🔔(3)</span>
				</Tooltip.TooltipTrigger>
			</SimpleTooltip>
		</div>
	</Tooltip.TooltipProvider>
);

export const WithText = () => (
	<Tooltip.TooltipProvider>
		<p>
			Hello this is a test with{" "}
			<SimpleTooltip label="This is a tooltip">
				<Tooltip.TooltipTrigger asChild>
					<a href="https://workos.com">Tooltip.Tooltip</a>
				</Tooltip.TooltipTrigger>
			</SimpleTooltip>{" "}
			inside a Text Component{" "}
			<SimpleTooltip label="This is a tooltip" side="top">
				<Tooltip.TooltipTrigger asChild>
					<a href="https://workos.com">Tooltip.Tooltip</a>
				</Tooltip.TooltipTrigger>
			</SimpleTooltip>{" "}
			some more text{" "}
			<SimpleTooltip label="This is a tooltip" side="right" align="center">
				<Tooltip.TooltipTrigger asChild>
					<a href="https://workos.com">Tooltip.Tooltip</a>
				</Tooltip.TooltipTrigger>
			</SimpleTooltip>{" "}
		</p>
	</Tooltip.TooltipProvider>
);

export const WithExternalRef = () => {
	const buttonRef = React.useRef<HTMLButtonElement>(null);

	React.useEffect(() => {
		if (buttonRef.current) {
			buttonRef.current.style.boxShadow = "0 0 0 2px red";
		}
	});

	return (
		<Tooltip.TooltipProvider>
			<SimpleTooltip label="Save document" side="bottom" align="end">
				<Tooltip.TooltipTrigger
					ref={buttonRef}
					type="button"
					style={{ margin: 100 }}
				>
					Save
				</Tooltip.TooltipTrigger>
			</SimpleTooltip>
		</Tooltip.TooltipProvider>
	);
};

export const Unmount = () => {
	const [isMounted, setIsMounted] = React.useState(true);
	return (
		<Tooltip.TooltipProvider>
			<ul>
				<li>Focus the first button (tooltip 1 shows)</li>
				<li>Focus the second button (tooltip 2 shows)</li>
				<li>Press escape (second button unmounts)</li>
				<li>Focus the first button (tooltip 1 should still show)</li>
			</ul>
			<SimpleTooltip label="tooltip 1">
				<Tooltip.TooltipTrigger
					style={{ alignSelf: "flex-start", margin: "0vmin" }}
				>
					Tool 1
				</Tooltip.TooltipTrigger>
			</SimpleTooltip>

			{isMounted && (
				<SimpleTooltip label="tooltip 2">
					<Tooltip.TooltipTrigger
						style={{ alignSelf: "flex-start", margin: "0vmin" }}
						onKeyDown={(event) => event.key === "Escape" && setIsMounted(false)}
					>
						Tool 2
					</Tooltip.TooltipTrigger>
				</SimpleTooltip>
			)}
		</Tooltip.TooltipProvider>
	);
};

export const Animated = () => {
	return (
		<Tooltip.TooltipProvider>
			<div style={{ padding: 100 }}>
				<SimpleTooltip className={animatedContentClass()} label="Hello world 1">
					<Tooltip.TooltipTrigger style={{ marginRight: 10 }}>
						Hello 1
					</Tooltip.TooltipTrigger>
				</SimpleTooltip>

				<SimpleTooltip
					className={animatedContentClass()}
					label="Hello world 2"
					side="top"
				>
					<Tooltip.TooltipTrigger>Hello 2</Tooltip.TooltipTrigger>
				</SimpleTooltip>
			</div>
		</Tooltip.TooltipProvider>
	);
};

export const SlottableContent = () => (
	<Tooltip.TooltipProvider>
		<Tooltip.Tooltip>
			<Tooltip.TooltipTrigger className={triggerClass()}>
				Hover or Focus me
			</Tooltip.TooltipTrigger>
			<Tooltip.TooltipPortal>
				<Tooltip.TooltipContent asChild sideOffset={5}>
					<div className={contentClass()}>
						Nicely done!
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</div>
				</Tooltip.TooltipContent>
			</Tooltip.TooltipPortal>
		</Tooltip.Tooltip>
	</Tooltip.TooltipProvider>
);

export const WithinDialog = () => (
	<Tooltip.TooltipProvider>
		<DialogPrimitive.Root>
			<DialogPrimitive.Trigger>Open dialog</DialogPrimitive.Trigger>
			<DialogPrimitive.Content>
				<DialogPrimitive.Title>Dialog title</DialogPrimitive.Title>
				<DialogPrimitive.Description>
					Dialog description
				</DialogPrimitive.Description>
				<DialogPrimitive.Close>Close dialog</DialogPrimitive.Close>
				<Tooltip.Tooltip>
					<Tooltip.TooltipTrigger className={triggerClass()}>
						Hover or Focus me
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipPortal>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.TooltipPortal>
				</Tooltip.Tooltip>
			</DialogPrimitive.Content>
		</DialogPrimitive.Root>
	</Tooltip.TooltipProvider>
);

export const KeepOpenOnActivation = () => {
	const triggerRef = React.useRef(null);

	return (
		<Tooltip.TooltipProvider>
			<Tooltip.Tooltip>
				<Tooltip.TooltipTrigger
					ref={triggerRef}
					className={triggerClass()}
					onClick={(event) => event.preventDefault()}
				>
					Hover or Focus me
				</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent
						className={contentClass()}
						sideOffset={5}
						onPointerDownOutside={(event) => {
							if (event.target === triggerRef.current) event.preventDefault();
						}}
					>
						Nicely done!
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>
		</Tooltip.TooltipProvider>
	);
};

export const WithinScrollable = () => (
	<Tooltip.TooltipProvider>
		<div
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				height: 500,
				width: 300,
				border: "1px solid black",
				overflow: "auto",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: 600,
				}}
			>
				<Tooltip.Tooltip>
					<Tooltip.TooltipTrigger className={triggerClass()}>
						Hover or Focus me
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipPortal>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.TooltipPortal>
				</Tooltip.Tooltip>
			</div>
		</div>
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "150vh",
			}}
		>
			<Tooltip.Tooltip>
				<Tooltip.TooltipTrigger className={triggerClass()}>
					Hover or Focus me
				</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						Nicely done!
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>
		</div>
	</Tooltip.TooltipProvider>
);

export const DisableHoverableContent = () => (
	<>
		<h1>Hoverable content (Default)</h1>
		<p>Content remains open while moving pointer to it</p>
		<div style={{ display: "flex", gap: 50 }}>
			<Tooltip.TooltipProvider skipDelayDuration={1000}>
				<Tooltip.Tooltip>
					<Tooltip.TooltipTrigger className={triggerClass()}>
						Hover me
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipPortal>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.TooltipPortal>
				</Tooltip.Tooltip>
			</Tooltip.TooltipProvider>
		</div>

		<h1>Disable hoverable content</h1>
		<p>Tooltip closes when pointer leaves the trigger</p>
		<h2>Inherited from provider</h2>
		<div style={{ display: "flex", gap: 50 }}>
			<Tooltip.TooltipProvider delayDuration={0} disableHoverableContent>
				<Tooltip.Tooltip>
					<Tooltip.TooltipTrigger className={triggerClass()}>
						Hover me
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipPortal>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.TooltipPortal>
				</Tooltip.Tooltip>
			</Tooltip.TooltipProvider>
		</div>
		<h2>Inherited value overridden by prop on tooltip</h2>
		<div style={{ display: "flex", gap: 50 }}>
			<Tooltip.TooltipProvider delayDuration={0} disableHoverableContent>
				<Tooltip.Tooltip>
					<Tooltip.TooltipTrigger className={triggerClass()}>
						Disabled hoverable content
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipPortal>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.TooltipPortal>
				</Tooltip.Tooltip>
				<Tooltip.Tooltip disableHoverableContent={false}>
					<Tooltip.TooltipTrigger className={triggerClass()}>
						Hoverable content
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipPortal>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.TooltipPortal>
				</Tooltip.Tooltip>
			</Tooltip.TooltipProvider>
		</div>
	</>
);

// change order slightly for more pleasing visual
type Side = "top" | "right" | "bottom" | "left";
const SIDES: Side[] = [
	...SIDE_OPTIONS.filter(
		(side): side is Exclude<(typeof SIDE_OPTIONS)[number], "bottom"> =>
			side !== "bottom",
	),
	"bottom",
];

export const Chromatic = () => (
	<Tooltip.TooltipProvider>
		<div style={{ padding: 200 }}>
			<h1>Uncontrolled</h1>
			<h2>Closed</h2>
			<Tooltip.Tooltip>
				<Tooltip.TooltipTrigger className={triggerClass()}>
					open
				</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						Some content
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>

			<h2 style={{ marginBottom: 60 }}>Open</h2>
			<Tooltip.Tooltip defaultOpen>
				<Tooltip.TooltipTrigger className={triggerClass()}>
					open
				</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						Some content
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>

			<h2 style={{ marginTop: 60, marginBottom: 60 }}>
				Open with reordered parts
			</h2>
			<Tooltip.Tooltip defaultOpen>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						Some content
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
				<Tooltip.TooltipTrigger className={triggerClass()}>
					open
				</Tooltip.TooltipTrigger>
			</Tooltip.Tooltip>

			<h1 style={{ marginTop: 100 }}>Controlled</h1>
			<h2>Closed</h2>
			<Tooltip.Tooltip open={false}>
				<Tooltip.TooltipTrigger className={triggerClass()}>
					open
				</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						Some content
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>

			<h2 style={{ marginBottom: 60 }}>Open</h2>
			<Tooltip.Tooltip open>
				<Tooltip.TooltipTrigger className={triggerClass()}>
					open
				</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						Some content
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>

			<h2 style={{ marginTop: 60, marginBottom: 60 }}>
				Open with reordered parts
			</h2>
			<Tooltip.Tooltip open>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						Some content
						<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
				<Tooltip.TooltipTrigger className={triggerClass()}>
					open
				</Tooltip.TooltipTrigger>
			</Tooltip.Tooltip>

			<h1 style={{ marginTop: 100 }}>Positioning</h1>
			<h2>No collisions</h2>
			<h3>Side & Align</h3>
			<div className={gridClass()}>
				{SIDES.map((side) =>
					ALIGN_OPTIONS.map((align) => (
						<Tooltip.Tooltip key={`${side}-${align}`} open>
							<Tooltip.TooltipTrigger className={chromaticTriggerClass()} />
							<Tooltip.TooltipPortal>
								<Tooltip.TooltipContent
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
									<Tooltip.TooltipArrow
										className={chromaticArrowClass()}
										width={20}
										height={10}
									/>
								</Tooltip.TooltipContent>
							</Tooltip.TooltipPortal>
						</Tooltip.Tooltip>
					)),
				)}
			</div>

			<h3>Side offset</h3>
			<h4>Positive</h4>
			<div className={gridClass()}>
				{SIDES.map((side) =>
					ALIGN_OPTIONS.map((align) => (
						<Tooltip.Tooltip key={`${side}-${align}`} open>
							<Tooltip.TooltipTrigger className={chromaticTriggerClass()} />
							<Tooltip.TooltipPortal>
								<Tooltip.TooltipContent
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
									<Tooltip.TooltipArrow
										className={chromaticArrowClass()}
										width={20}
										height={10}
									/>
								</Tooltip.TooltipContent>
							</Tooltip.TooltipPortal>
						</Tooltip.Tooltip>
					)),
				)}
			</div>
			<h4>Negative</h4>
			<div className={gridClass()}>
				{SIDES.map((side) =>
					ALIGN_OPTIONS.map((align) => (
						<Tooltip.Tooltip key={`${side}-${align}`} open>
							<Tooltip.TooltipTrigger className={chromaticTriggerClass()} />
							<Tooltip.TooltipPortal>
								<Tooltip.TooltipContent
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
									<Tooltip.TooltipArrow
										className={chromaticArrowClass()}
										width={20}
										height={10}
									/>
								</Tooltip.TooltipContent>
							</Tooltip.TooltipPortal>
						</Tooltip.Tooltip>
					)),
				)}
			</div>

			<h3>Align offset</h3>
			<h4>Positive</h4>
			<div className={gridClass()}>
				{SIDES.map((side) =>
					ALIGN_OPTIONS.map((align) => (
						<Tooltip.Tooltip key={`${side}-${align}`} open>
							<Tooltip.TooltipTrigger className={chromaticTriggerClass()} />
							<Tooltip.TooltipPortal>
								<Tooltip.TooltipContent
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
									<Tooltip.TooltipArrow
										className={chromaticArrowClass()}
										width={20}
										height={10}
									/>
								</Tooltip.TooltipContent>
							</Tooltip.TooltipPortal>
						</Tooltip.Tooltip>
					)),
				)}
			</div>
			<h4>Negative</h4>
			<div className={gridClass()}>
				{SIDES.map((side) =>
					ALIGN_OPTIONS.map((align) => (
						<Tooltip.Tooltip key={`${side}-${align}`} open>
							<Tooltip.TooltipTrigger className={chromaticTriggerClass()} />
							<Tooltip.TooltipPortal>
								<Tooltip.TooltipContent
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
									<Tooltip.TooltipArrow
										className={chromaticArrowClass()}
										width={20}
										height={10}
									/>
								</Tooltip.TooltipContent>
							</Tooltip.TooltipPortal>
						</Tooltip.Tooltip>
					)),
				)}
			</div>

			<h2>Collisions</h2>
			<p>See instances on the periphery of the page.</p>
			{SIDES.map((side) =>
				ALIGN_OPTIONS.map((align) => (
					<Tooltip.Tooltip key={`${side}-${align}`} open>
						<Tooltip.TooltipTrigger
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
						<Tooltip.TooltipPortal>
							<Tooltip.TooltipContent
								className={chromaticContentClass()}
								side={side}
								align={align}
							>
								<p style={{ textAlign: "center" }}>
									{side}
									<br />
									{align}
								</p>
								<Tooltip.TooltipArrow
									className={chromaticArrowClass()}
									width={20}
									height={10}
								/>
							</Tooltip.TooltipContent>
						</Tooltip.TooltipPortal>
					</Tooltip.Tooltip>
				)),
			)}

			<h2 style={{ marginTop: 50, marginBottom: 60 }}>
				Relative parent (non-portalled)
			</h2>
			<div style={{ position: "relative" }}>
				<Tooltip.TooltipProvider>
					<Tooltip.Tooltip open>
						<Tooltip.TooltipTrigger className={triggerClass()}>
							Hover or Focus me
						</Tooltip.TooltipTrigger>
						<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
							Nicely done!
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</Tooltip.TooltipContent>
					</Tooltip.Tooltip>
				</Tooltip.TooltipProvider>
			</div>

			<h1 style={{ marginTop: 100, marginBottom: 60 }}>With slotted trigger</h1>
			<Tooltip.Tooltip open>
				<Tooltip.TooltipTrigger asChild>
					<button className={triggerClass()}>open</button>
				</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent className={contentClass()} sideOffset={5}>
						Some content
						<Tooltip.TooltipArrow
							className={arrowClass()}
							width={20}
							height={10}
							offset={10}
						/>
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>

			<h1 style={{ marginTop: 100, marginBottom: 60 }}>With slotted content</h1>
			<Tooltip.Tooltip open>
				<Tooltip.TooltipTrigger className={triggerClass()}>
					Hover or Focus me
				</Tooltip.TooltipTrigger>
				<Tooltip.TooltipPortal>
					<Tooltip.TooltipContent asChild sideOffset={5}>
						<div className={contentClass()}>
							Some content
							<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
						</div>
					</Tooltip.TooltipContent>
				</Tooltip.TooltipPortal>
			</Tooltip.Tooltip>
		</div>
	</Tooltip.TooltipProvider>
);
Chromatic.parameters = { chromatic: { disable: false } };

function SimpleTooltip({
	children,
	label,
	"aria-label": ariaLabel,
	open,
	onOpenChange,
	...props
}: any) {
	return (
		<Tooltip.Tooltip open={open} onOpenChange={onOpenChange}>
			{children}
			<Tooltip.TooltipPortal>
				<Tooltip.TooltipContent
					className={contentClass()}
					sideOffset={5}
					aria-label={ariaLabel}
					{...props}
				>
					{label}
					<Tooltip.TooltipArrow className={arrowClass()} offset={10} />
				</Tooltip.TooltipContent>
			</Tooltip.TooltipPortal>
		</Tooltip.Tooltip>
	);
}

const positionButtonClass = css({
	margin: 5,
	border: "1px solid black",
	background: "transparent",
});

const triggerClass = css({});

const RECOMMENDED_CSS__TOOLTIP__CONTENT: any = {
	transformOrigin: "var(--squared-tooltip-content-transform-origin)",
	// ensures content isn't selectable
	// this is just a detterent to people putting interactive content inside a `Tooltip.Tooltip`
	userSelect: "none",
};

const contentClass = css({
	...RECOMMENDED_CSS__TOOLTIP__CONTENT,
	backgroundColor: "$black",
	color: "$white",
	fontSize: 12,
	borderRadius: 5,
	padding: 10,
	maxWidth: 300,
});

const arrowClass = css({
	fill: "$black",
});

const scaleIn = keyframes({
	"0%": { opacity: 0, transform: "scale(0)" },
	"100%": { opacity: 1, transform: "scale(1)" },
});

const fadeIn = keyframes({
	"0%": { opacity: 0 },
	"100%": { opacity: 1 },
});

const fadeOut = keyframes({
	"0%": { opacity: 1 },
	"100%": { opacity: 0 },
});

const animatedContentClass = css(contentClass, {
	'&[data-state="delayed-open"]': {
		animation: `${scaleIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
	},
	'&[data-state="instant-open"]': {
		animation: `${fadeIn} 0.2s ease-out`,
	},
	'&[data-state="closed"]': {
		animation: `${fadeOut} 0.2s ease-out`,
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
