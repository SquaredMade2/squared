import * as DialogPrimitive from "../dialog";

import { useRef, useState } from "react";
import { css, keyframes } from "../../stitches.config";

export default { title: "Components/Dialog" };

export const Styled = () => (
	<DialogPrimitive.Root>
		<DialogPrimitive.Trigger className={triggerClass()}>
			open
		</DialogPrimitive.Trigger>
		<DialogPrimitive.Portal>
			<DialogPrimitive.Overlay className={overlayClass()} />
			<DialogPrimitive.Content className={contentDefaultClass()}>
				<DialogPrimitive.Title>Booking info</DialogPrimitive.Title>
				<DialogPrimitive.Description>
					Please enter the info for your booking below.
				</DialogPrimitive.Description>
				<DialogPrimitive.Close className={closeClass()}>
					close
				</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	</DialogPrimitive.Root>
);

export const NonModal = () => (
	<>
		<DialogPrimitive.Root modal={false}>
			<DialogPrimitive.Trigger className={triggerClass()}>
				open (non-modal)
			</DialogPrimitive.Trigger>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className={overlayClass()} />
				<DialogPrimitive.Content
					className={contentSheetClass()}
					onInteractOutside={(event) => event.preventDefault()}
				>
					<DialogPrimitive.Title>Booking info</DialogPrimitive.Title>
					<DialogPrimitive.Description>Description</DialogPrimitive.Description>
					<DialogPrimitive.Close className={closeClass()}>
						close
					</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>

		{Array.from({ length: 5 }, (_, i) => (
			<div key={i} style={{ marginTop: 20 }}>
				<textarea
					style={{ width: 800, height: 400 }}
					defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet, minima expedita alias et fugit voluptate laborum placeat odio dolore ab!"
				/>
			</div>
		))}
	</>
);

export const Controlled = () => {
	const [open, setOpen] = useState(false);
	return (
		<DialogPrimitive.Root open={open} onOpenChange={setOpen}>
			<DialogPrimitive.Trigger>
				{open ? "close" : "open"}
			</DialogPrimitive.Trigger>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className={overlayClass()} />
				<DialogPrimitive.Content className={contentDefaultClass()}>
					<DialogPrimitive.Title>Title</DialogPrimitive.Title>
					<DialogPrimitive.Description>Description</DialogPrimitive.Description>
					<DialogPrimitive.Close>close</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
};

export const FocusTrap = () => (
	<>
		<DialogPrimitive.Root>
			<DialogPrimitive.Trigger>open</DialogPrimitive.Trigger>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className={overlayClass()} />
				<DialogPrimitive.Content className={contentDefaultClass()}>
					<DialogPrimitive.Close>close</DialogPrimitive.Close>
					<DialogPrimitive.Title>Title</DialogPrimitive.Title>
					<DialogPrimitive.Description>Description</DialogPrimitive.Description>
					<div>
						<label htmlFor="firstName">First Name</label>
						<input type="text" id="firstName" placeholder="John" />

						<label htmlFor="lastName">Last Name</label>
						<input type="text" id="lastName" placeholder="Doe" />

						<button type="submit">Send</button>
					</div>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>

		<p>These elements can't be focused when the dialog is opened.</p>
		<button type="button">A button</button>
		<input type="text" placeholder="Another focusable element" />
	</>
);

export const CustomFocus = () => {
	const firstNameRef = useRef<HTMLInputElement>(null);
	const searchFieldRef = useRef<HTMLInputElement>(null);
	return (
		<>
			<DialogPrimitive.Root>
				<DialogPrimitive.Trigger>open</DialogPrimitive.Trigger>
				<DialogPrimitive.Portal>
					<DialogPrimitive.Overlay className={overlayClass()} />
					<DialogPrimitive.Content
						className={contentDefaultClass()}
						onOpenAutoFocus={(event) => {
							event.preventDefault();
							firstNameRef.current?.focus();
						}}
						onCloseAutoFocus={(event) => {
							event.preventDefault();
							searchFieldRef.current?.focus();
						}}
					>
						<DialogPrimitive.Close>close</DialogPrimitive.Close>

						<div>
							<DialogPrimitive.Title>Title</DialogPrimitive.Title>
							<DialogPrimitive.Description>
								The first name input will receive the focus after opening the
								dialog.
							</DialogPrimitive.Description>
							<label htmlFor="firstName">First Name</label>
							<input
								type="text"
								id="firstName"
								placeholder="John"
								ref={firstNameRef}
							/>

							<label htmlFor="lastName">Last Name</label>
							<input type="text" id="lastName" placeholder="Doe" />

							<button type="submit">Send</button>
						</div>
					</DialogPrimitive.Content>
				</DialogPrimitive.Portal>
			</DialogPrimitive.Root>

			<div>
				<p>The search input will receive the focus after closing the dialog.</p>
				<input type="text" placeholder="Search…" ref={searchFieldRef} />
			</div>
		</>
	);
};

export const NoEscapeDismiss = () => (
	<DialogPrimitive.Root>
		<DialogPrimitive.Trigger>open</DialogPrimitive.Trigger>
		<DialogPrimitive.Portal>
			<DialogPrimitive.Overlay className={overlayClass()} />
			<DialogPrimitive.Content
				className={contentDefaultClass()}
				onEscapeKeyDown={(event) => event.preventDefault()}
			>
				<DialogPrimitive.Title>Title</DialogPrimitive.Title>
				<DialogPrimitive.Description>
					The first name input will receive the focus after opening the dialog.
				</DialogPrimitive.Description>
				<DialogPrimitive.Close>close</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	</DialogPrimitive.Root>
);

export const NoPointerDownOutsideDismiss = () => (
	<DialogPrimitive.Root>
		<DialogPrimitive.Trigger>open</DialogPrimitive.Trigger>
		<DialogPrimitive.Portal>
			<DialogPrimitive.Overlay className={overlayClass()} />
			<DialogPrimitive.Content
				className={contentDefaultClass()}
				onPointerDownOutside={(event) => event.preventDefault()}
			>
				<DialogPrimitive.Title>Title</DialogPrimitive.Title>
				<DialogPrimitive.Description>Description</DialogPrimitive.Description>
				<DialogPrimitive.Close>close</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	</DialogPrimitive.Root>
);

export const WithPortalContainer = () => {
	const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
		null,
	);
	return (
		<>
			<DialogPrimitive.Root>
				<DialogPrimitive.Trigger>open</DialogPrimitive.Trigger>
				<DialogPrimitive.Portal container={portalContainer}>
					<DialogPrimitive.Overlay className={overlayClass()} />
					<DialogPrimitive.Content className={contentDefaultClass()}>
						<DialogPrimitive.Title>Title</DialogPrimitive.Title>
						<DialogPrimitive.Description>
							Description
						</DialogPrimitive.Description>
						<DialogPrimitive.Close>close</DialogPrimitive.Close>
					</DialogPrimitive.Content>
				</DialogPrimitive.Portal>
			</DialogPrimitive.Root>
			<div data-portal-container="" ref={setPortalContainer} />
		</>
	);
};

export const Animated = () => (
	<DialogPrimitive.Root>
		<DialogPrimitive.Trigger>open</DialogPrimitive.Trigger>
		<DialogPrimitive.Portal>
			<DialogPrimitive.Overlay className={animatedOverlayClass()} />
			<DialogPrimitive.Content className={animatedContentClass()}>
				<DialogPrimitive.Title>Title</DialogPrimitive.Title>
				<DialogPrimitive.Description>Description</DialogPrimitive.Description>
				<DialogPrimitive.Close>close</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	</DialogPrimitive.Root>
);

export const ForcedMount = () => (
	<DialogPrimitive.Root>
		<DialogPrimitive.Trigger>open</DialogPrimitive.Trigger>
		<DialogPrimitive.Portal forceMount>
			<DialogPrimitive.Overlay className={overlayClass()} />
			<DialogPrimitive.Content className={contentDefaultClass()}>
				<DialogPrimitive.Title>Title</DialogPrimitive.Title>
				<DialogPrimitive.Description>Description</DialogPrimitive.Description>
				<DialogPrimitive.Close>close</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	</DialogPrimitive.Root>
);

export const InnerScrollable = () => (
	<DialogPrimitive.Root>
		<DialogPrimitive.Trigger className={triggerClass()}>
			open
		</DialogPrimitive.Trigger>
		<DialogPrimitive.Portal>
			<DialogPrimitive.Overlay className={overlayClass()} />
			<DialogPrimitive.Content className={contentScrollableClass()}>
				<DialogPrimitive.Title>Booking info</DialogPrimitive.Title>
				<DialogPrimitive.Description>
					Please enter the info for your booking below.
				</DialogPrimitive.Description>
				<div style={{ backgroundColor: "#eee", height: 500 }} />
				<DialogPrimitive.Close className={closeClass()}>
					close
				</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	</DialogPrimitive.Root>
);

export const OuterScrollable = () => (
	<DialogPrimitive.Root>
		<DialogPrimitive.Trigger className={triggerClass()}>
			open
		</DialogPrimitive.Trigger>
		<div style={{ backgroundColor: "#eee", width: 300, height: 1000 }} />
		<DialogPrimitive.Portal>
			<DialogPrimitive.Overlay className={scrollableOverlayClass()}>
				<DialogPrimitive.Content className={contentInScrollableOverlayClass()}>
					<DialogPrimitive.Title>Booking info</DialogPrimitive.Title>
					<DialogPrimitive.Description>
						Please enter the info for your booking below.
					</DialogPrimitive.Description>
					<div style={{ backgroundColor: "#eee", height: 500 }} />
					<DialogPrimitive.Close className={closeClass()}>
						close
					</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogPrimitive.Overlay>
		</DialogPrimitive.Portal>
	</DialogPrimitive.Root>
);

export const Chromatic = () => (
	<>
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(4, 1fr)",
				height: "50vh",
			}}
		>
			<div>
				<h1>Uncontrolled</h1>
				<h2>Closed</h2>
				<DialogPrimitive.Root>
					<DialogPrimitive.Trigger className={triggerClass()}>
						open
					</DialogPrimitive.Trigger>
					<DialogPrimitive.Portal>
						<DialogPrimitive.Overlay className={overlayClass()} />
						<DialogPrimitive.Content className={chromaticContentClass()}>
							<DialogPrimitive.Title>Title</DialogPrimitive.Title>
							<DialogPrimitive.Description>
								Description
							</DialogPrimitive.Description>
							<DialogPrimitive.Close className={closeClass()}>
								close
							</DialogPrimitive.Close>
						</DialogPrimitive.Content>
					</DialogPrimitive.Portal>
				</DialogPrimitive.Root>

				<h2>Open</h2>
				<DialogPrimitive.Root defaultOpen>
					<DialogPrimitive.Trigger className={triggerClass()}>
						open
					</DialogPrimitive.Trigger>
					<DialogPrimitive.Portal>
						<DialogPrimitive.Overlay
							className={overlayClass()}
							style={{ left: 0, bottom: "50%", width: "25%" }}
						/>
						<DialogPrimitive.Content
							className={chromaticContentClass()}
							style={{ top: "25%", left: "12%" }}
						>
							<DialogPrimitive.Title>Title</DialogPrimitive.Title>
							<DialogPrimitive.Description>
								Description
							</DialogPrimitive.Description>
							<DialogPrimitive.Close className={closeClass()}>
								close
							</DialogPrimitive.Close>
						</DialogPrimitive.Content>
					</DialogPrimitive.Portal>
				</DialogPrimitive.Root>
			</div>

			<div>
				<h1>Uncontrolled with reordered parts</h1>
				<h2>Closed</h2>
				<DialogPrimitive.Root>
					<DialogPrimitive.Portal>
						<DialogPrimitive.Overlay className={overlayClass()} />
						<DialogPrimitive.Content className={chromaticContentClass()}>
							<DialogPrimitive.Title>Title</DialogPrimitive.Title>
							<DialogPrimitive.Description>
								Description
							</DialogPrimitive.Description>
							<DialogPrimitive.Close className={closeClass()}>
								close
							</DialogPrimitive.Close>
						</DialogPrimitive.Content>
					</DialogPrimitive.Portal>
					<DialogPrimitive.Trigger className={triggerClass()}>
						open
					</DialogPrimitive.Trigger>
				</DialogPrimitive.Root>

				<h2>Open</h2>
				<DialogPrimitive.Root defaultOpen>
					<DialogPrimitive.Portal>
						<DialogPrimitive.Overlay
							className={overlayClass()}
							style={{ left: "25%", bottom: "50%", width: "25%" }}
						/>
						<DialogPrimitive.Content
							className={chromaticContentClass()}
							style={{ top: "25%", left: "37%" }}
						>
							<DialogPrimitive.Title>Title</DialogPrimitive.Title>
							<DialogPrimitive.Description>
								Description
							</DialogPrimitive.Description>
							<DialogPrimitive.Close className={closeClass()}>
								close
							</DialogPrimitive.Close>
						</DialogPrimitive.Content>
					</DialogPrimitive.Portal>
					<DialogPrimitive.Trigger className={triggerClass()}>
						open
					</DialogPrimitive.Trigger>
				</DialogPrimitive.Root>
			</div>

			<div>
				<h1>Controlled</h1>
				<h2>Closed</h2>
				<DialogPrimitive.Root open={false}>
					<DialogPrimitive.Trigger className={triggerClass()}>
						open
					</DialogPrimitive.Trigger>
					<DialogPrimitive.Portal>
						<DialogPrimitive.Overlay className={overlayClass()} />
						<DialogPrimitive.Content className={chromaticContentClass()}>
							<DialogPrimitive.Title>Title</DialogPrimitive.Title>
							<DialogPrimitive.Description>
								Description
							</DialogPrimitive.Description>
							<DialogPrimitive.Close className={closeClass()}>
								close
							</DialogPrimitive.Close>
						</DialogPrimitive.Content>
					</DialogPrimitive.Portal>
				</DialogPrimitive.Root>

				<h2>Open</h2>
				<DialogPrimitive.Root open>
					<DialogPrimitive.Trigger className={triggerClass()}>
						open
					</DialogPrimitive.Trigger>
					<DialogPrimitive.Portal>
						<DialogPrimitive.Overlay
							className={overlayClass()}
							style={{ left: "50%", bottom: "50%", width: "25%" }}
						/>
						<DialogPrimitive.Content
							className={chromaticContentClass()}
							style={{ top: "25%", left: "62%" }}
						>
							<DialogPrimitive.Title>Title</DialogPrimitive.Title>
							<DialogPrimitive.Description>
								Description
							</DialogPrimitive.Description>
							<DialogPrimitive.Close className={closeClass()}>
								close
							</DialogPrimitive.Close>
						</DialogPrimitive.Content>
					</DialogPrimitive.Portal>
				</DialogPrimitive.Root>
			</div>

			<div>
				<h1>Controlled with reordered parts</h1>
				<h2>Closed</h2>
				<DialogPrimitive.Root open={false}>
					<DialogPrimitive.Portal>
						<DialogPrimitive.Overlay className={overlayClass()} />
						<DialogPrimitive.Content className={chromaticContentClass()}>
							<DialogPrimitive.Title>Title</DialogPrimitive.Title>
							<DialogPrimitive.Description>
								Description
							</DialogPrimitive.Description>
							<DialogPrimitive.Close className={closeClass()}>
								close
							</DialogPrimitive.Close>
						</DialogPrimitive.Content>
					</DialogPrimitive.Portal>
					<DialogPrimitive.Trigger className={triggerClass()}>
						open
					</DialogPrimitive.Trigger>
				</DialogPrimitive.Root>

				<h2>Open</h2>
				<DialogPrimitive.Root open>
					<DialogPrimitive.Portal>
						<DialogPrimitive.Overlay
							className={overlayClass()}
							style={{ left: "75%", bottom: "50%", width: "25%" }}
						/>
						<DialogPrimitive.Content
							className={chromaticContentClass()}
							style={{ top: "25%", left: "88%" }}
						>
							<DialogPrimitive.Title>Title</DialogPrimitive.Title>
							<DialogPrimitive.Description>
								Description
							</DialogPrimitive.Description>
							<DialogPrimitive.Close className={closeClass()}>
								close
							</DialogPrimitive.Close>
						</DialogPrimitive.Content>
					</DialogPrimitive.Portal>
					<DialogPrimitive.Trigger className={triggerClass()}>
						open
					</DialogPrimitive.Trigger>
				</DialogPrimitive.Root>
			</div>
		</div>

		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(2, 1fr)",
				height: "50vh",
			}}
		>
			<div>
				<h1>Forced mount</h1>
				<DialogPrimitive.Root>
					<DialogPrimitive.Trigger className={triggerClass()}>
						open
					</DialogPrimitive.Trigger>
					<DialogPrimitive.Portal forceMount>
						<DialogPrimitive.Overlay
							className={overlayClass()}
							style={{
								top: "50%",
								backgroundColor: "rgba(0, 0, 0, 0.3)",
							}}
						/>
						<DialogPrimitive.Content
							className={chromaticContentClass()}
							style={{ left: "25%", top: "75%" }}
						>
							<DialogPrimitive.Title>Title</DialogPrimitive.Title>
							<DialogPrimitive.Description>
								Description
							</DialogPrimitive.Description>
							<DialogPrimitive.Close className={closeClass()}>
								close
							</DialogPrimitive.Close>
						</DialogPrimitive.Content>
					</DialogPrimitive.Portal>
				</DialogPrimitive.Root>
			</div>

			<div>
				<h1>State attributes</h1>
				<h2>Closed</h2>
				<DialogPrimitive.Root>
					<DialogPrimitive.Trigger className={triggerAttrClass()}>
						open
					</DialogPrimitive.Trigger>
					<DialogPrimitive.Portal>
						<DialogPrimitive.Overlay className={overlayAttrClass()} />
						<DialogPrimitive.Content className={contentAttrClass()}>
							<DialogPrimitive.Title>Title</DialogPrimitive.Title>
							<DialogPrimitive.Description>
								Description
							</DialogPrimitive.Description>
							<DialogPrimitive.Close className={closeAttrClass()}>
								close
							</DialogPrimitive.Close>
						</DialogPrimitive.Content>
					</DialogPrimitive.Portal>
				</DialogPrimitive.Root>

				<h2>Open</h2>
				<DialogPrimitive.Root defaultOpen>
					<DialogPrimitive.Trigger className={triggerAttrClass()}>
						open
					</DialogPrimitive.Trigger>
					<DialogPrimitive.Portal>
						<DialogPrimitive.Overlay
							className={overlayAttrClass()}
							style={{ left: "50%", top: "50%" }}
						/>
						<DialogPrimitive.Content
							className={contentAttrClass()}
							style={{ left: "75%", top: "75%" }}
						>
							<DialogPrimitive.Title>Title</DialogPrimitive.Title>
							<DialogPrimitive.Description>
								Description
							</DialogPrimitive.Description>
							<DialogPrimitive.Close className={closeAttrClass()}>
								close
							</DialogPrimitive.Close>
						</DialogPrimitive.Content>
					</DialogPrimitive.Portal>
				</DialogPrimitive.Root>
			</div>
		</div>
	</>
);
Chromatic.parameters = { chromatic: { disable: false } };

export const Cypress = () => {
	const [modal, setModal] = useState(true);
	const [animated, setAnimated] = useState(false);
	const [count, setCount] = useState(0);
	const [hasDestroyButton, setHasDestroyButton] = useState(true);

	return (
		<>
			<DialogPrimitive.Root modal={modal}>
				<DialogPrimitive.Trigger className={triggerClass()}>
					open
				</DialogPrimitive.Trigger>
				<DialogPrimitive.Portal>
					<DialogPrimitive.Content
						className={
							animated
								? animatedContentClass({
										css: {
											animationDuration: "50ms !important",
										},
									})
								: contentDefaultClass()
						}
					>
						<DialogPrimitive.Title>title</DialogPrimitive.Title>
						<DialogPrimitive.Description>
							description
						</DialogPrimitive.Description>
						<DialogPrimitive.Close className={closeClass()}>
							close
						</DialogPrimitive.Close>
						{hasDestroyButton && (
							<div>
								<button
									type="button"
									onClick={() => setHasDestroyButton(false)}
								>
									destroy me
								</button>
							</div>
						)}
					</DialogPrimitive.Content>
				</DialogPrimitive.Portal>
			</DialogPrimitive.Root>

			<br />
			<br />

			<label>
				<input
					type="checkbox"
					checked={modal}
					onChange={(event) => setModal(Boolean(event.target.checked))}
				/>{" "}
				modal
			</label>

			<br />

			<label>
				<input
					type="checkbox"
					checked={animated}
					onChange={(event) => setAnimated(Boolean(event.target.checked))}
				/>{" "}
				animated
			</label>

			<br />

			<label htmlFor="count">
				count up{" "}
				<button
					type="button"
					onClick={() => setCount((count) => count + 1)}
					id="count"
				>
					{count}
				</button>
			</label>

			<br />

			<label>
				name: <input type="text" placeholder="name" />
			</label>
		</>
	);
};

const triggerClass = css({});

const RECOMMENDED_CSS__DIALOG__OVERLAY: any = {
	// ensures overlay is positioned correctly
	position: "fixed",
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
};

const overlayClass = css({
	...RECOMMENDED_CSS__DIALOG__OVERLAY,
	backgroundColor: "rgba(0,0,0,0.2)",
});

const scrollableOverlayClass = css(overlayClass, {
	overflow: "auto",
	display: "flex",
	alignItems: "flex-start",
	justifyContent: "center",
});

const RECOMMENDED_CSS__DIALOG__CONTENT: any = {
	// ensures good default position for content
	position: "fixed",
	top: 0,
	left: 0,
};

const contentStyles = css({
	minWidth: 300,
	minHeight: 150,
	padding: 50,
	borderRadius: 10,
	backgroundColor: "white",
	boxShadow: "0 2px 10px rgba(0, 0, 0, 0.12)",
});

const contentDefaultClass = css(contentStyles, {
	...RECOMMENDED_CSS__DIALOG__CONTENT,
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
});

const contentScrollableClass = css(contentDefaultClass, {
	overflow: "auto",
	maxHeight: 300,
});

const contentInScrollableOverlayClass = css(contentStyles, {
	marginTop: 50,
	marginBottom: 50,
});

const contentSheetClass = css(contentStyles, {
	...RECOMMENDED_CSS__DIALOG__CONTENT,
	left: undefined,
	right: 0,
	minWidth: 300,
	minHeight: "100vh",
	borderTopRightRadius: 0,
	borderBottomRightRadius: 0,
});

const closeClass = css({});

const fadeIn = keyframes({
	from: { opacity: 0 },
	to: { opacity: 1 },
});

const fadeOut = keyframes({
	from: { opacity: 1 },
	to: { opacity: 0 },
});

const scaleIn = keyframes({
	from: { transform: "translate(-50%, -50%) scale(0.75)" },
	to: { transform: "translate(-50%, -50%) scale(1)" },
});

const animatedOverlayClass = css(overlayClass, {
	'&[data-state="open"]': {
		animation: `${fadeIn} 300ms ease-out`,
	},
	'&[data-state="closed"]': {
		animation: `${fadeOut} 300ms ease-in`,
	},
});

const animatedContentClass = css(contentDefaultClass, {
	'&[data-state="open"]': {
		animation: `${fadeIn} 150ms ease-out, ${scaleIn} 200ms ease-out`,
	},
	'&[data-state="closed"]': {
		animation: `${fadeOut} 300ms ease-in`,
	},
});

const chromaticContentClass = css(contentDefaultClass, {
	padding: 10,
	minWidth: "auto",
	minHeight: "auto",
});

const styles = {
	backgroundColor: "rgba(0, 0, 255, 0.3)",
	border: "2px solid blue",
	padding: 10,

	'&[data-state="closed"]': { borderColor: "red" },
	'&[data-state="open"]': { borderColor: "green" },
};
const triggerAttrClass = css(styles);
const overlayAttrClass = css(overlayClass, styles);
const contentAttrClass = css(chromaticContentClass, styles);
const closeAttrClass = css(styles);
