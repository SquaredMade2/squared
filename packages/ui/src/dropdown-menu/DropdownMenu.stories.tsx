import * as ReactDOM from "react-dom/client";
import * as DialogPrimitive from "../dialog";
import * as DropdownMenuPrimitive from "../dropdown-menu";
import { ALIGN_OPTIONS, SIDE_OPTIONS } from "../popper";
import * as Tooltip from "../tooltip";

import { type ElementRef, useCallback, useRef, useState } from "react";
import { css } from "../../stitches.config";
import { foodGroups } from "../../test-data/foods";
import { TickIcon, classes } from "../menu/Menu.stories";

const { contentClass, itemClass, labelClass, separatorClass, subTriggerClass } =
	classes;

export default { title: "Components/DropdownMenu" };

export const Styled = () => (
	<div
		style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			height: "200vh",
		}}
	>
		<DropdownMenuPrimitive.Root>
			<DropdownMenuPrimitive.Trigger className={triggerClass()}>
				Open
			</DropdownMenuPrimitive.Trigger>
			<DropdownMenuPrimitive.Portal>
				<DropdownMenuPrimitive.Content
					className={contentClass()}
					sideOffset={5}
				>
					<DropdownMenuPrimitive.Item
						className={itemClass()}
						onSelect={() => console.log("undo")}
					>
						Undo
					</DropdownMenuPrimitive.Item>
					<DropdownMenuPrimitive.Item
						className={itemClass()}
						onSelect={() => console.log("redo")}
					>
						Redo
					</DropdownMenuPrimitive.Item>
					<DropdownMenuPrimitive.Separator className={separatorClass()} />
					<DropdownMenuPrimitive.Item
						className={itemClass()}
						disabled
						onSelect={() => console.log("cut")}
					>
						Cut
					</DropdownMenuPrimitive.Item>
					<DropdownMenuPrimitive.Item
						className={itemClass()}
						onSelect={() => console.log("copy")}
					>
						Copy
					</DropdownMenuPrimitive.Item>
					<DropdownMenuPrimitive.Item
						className={itemClass()}
						onSelect={() => console.log("paste")}
					>
						Paste
					</DropdownMenuPrimitive.Item>
					<DropdownMenuPrimitive.Arrow />
				</DropdownMenuPrimitive.Content>
			</DropdownMenuPrimitive.Portal>
		</DropdownMenuPrimitive.Root>
	</div>
);

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
					<h1>Modal (default)</h1>
					<DropdownMenuPrimitive.Root>
						<DropdownMenuPrimitive.Trigger className={triggerClass()}>
							Open
						</DropdownMenuPrimitive.Trigger>
						<DropdownMenuPrimitive.Portal>
							<DropdownMenuPrimitive.Content
								className={contentClass()}
								sideOffset={5}
							>
								<DropdownMenuPrimitive.Item
									className={itemClass()}
									onSelect={() => console.log("undo")}
								>
									Undo
								</DropdownMenuPrimitive.Item>
								<DropdownMenuPrimitive.Item
									className={itemClass()}
									onSelect={() => console.log("redo")}
								>
									Redo
								</DropdownMenuPrimitive.Item>
								<DropdownMenuPrimitive.Separator className={separatorClass()} />
								<DropdownMenuPrimitive.Sub>
									<DropdownMenuPrimitive.SubTrigger
										className={subTriggerClass()}
									>
										Submenu →
									</DropdownMenuPrimitive.SubTrigger>
									<DropdownMenuPrimitive.Portal>
										<DropdownMenuPrimitive.SubContent
											className={contentClass()}
											sideOffset={12}
											alignOffset={-6}
										>
											<DropdownMenuPrimitive.Item
												className={itemClass()}
												onSelect={() => console.log("one")}
											>
												One
											</DropdownMenuPrimitive.Item>
											<DropdownMenuPrimitive.Item
												className={itemClass()}
												onSelect={() => console.log("two")}
											>
												Two
											</DropdownMenuPrimitive.Item>
											<DropdownMenuPrimitive.Item
												className={itemClass()}
												onSelect={() => console.log("three")}
											>
												Three
											</DropdownMenuPrimitive.Item>
											<DropdownMenuPrimitive.Arrow />
										</DropdownMenuPrimitive.SubContent>
									</DropdownMenuPrimitive.Portal>
								</DropdownMenuPrimitive.Sub>
								<DropdownMenuPrimitive.Separator className={separatorClass()} />
								<DropdownMenuPrimitive.Item
									className={itemClass()}
									disabled
									onSelect={() => console.log("cut")}
								>
									Cut
								</DropdownMenuPrimitive.Item>
								<DropdownMenuPrimitive.Item
									className={itemClass()}
									onSelect={() => console.log("copy")}
								>
									Copy
								</DropdownMenuPrimitive.Item>
								<DropdownMenuPrimitive.Item
									className={itemClass()}
									onSelect={() => console.log("paste")}
								>
									Paste
								</DropdownMenuPrimitive.Item>
								<DropdownMenuPrimitive.Arrow />
							</DropdownMenuPrimitive.Content>
						</DropdownMenuPrimitive.Portal>
					</DropdownMenuPrimitive.Root>
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
					<h1>Non modal</h1>
					<DropdownMenuPrimitive.Root modal={false}>
						<DropdownMenuPrimitive.Trigger className={triggerClass()}>
							Open
						</DropdownMenuPrimitive.Trigger>
						<DropdownMenuPrimitive.Portal>
							<DropdownMenuPrimitive.Content
								className={contentClass()}
								sideOffset={5}
							>
								<DropdownMenuPrimitive.Item
									className={itemClass()}
									onSelect={() => console.log("undo")}
								>
									Undo
								</DropdownMenuPrimitive.Item>
								<DropdownMenuPrimitive.Item
									className={itemClass()}
									onSelect={() => console.log("redo")}
								>
									Redo
								</DropdownMenuPrimitive.Item>
								<DropdownMenuPrimitive.Separator className={separatorClass()} />
								<DropdownMenuPrimitive.Sub>
									<DropdownMenuPrimitive.SubTrigger
										className={subTriggerClass()}
									>
										Submenu →
									</DropdownMenuPrimitive.SubTrigger>
									<DropdownMenuPrimitive.Portal>
										<DropdownMenuPrimitive.SubContent
											className={contentClass()}
											sideOffset={12}
											alignOffset={-6}
										>
											<DropdownMenuPrimitive.Item
												className={itemClass()}
												onSelect={() => console.log("one")}
											>
												One
											</DropdownMenuPrimitive.Item>
											<DropdownMenuPrimitive.Item
												className={itemClass()}
												onSelect={() => console.log("two")}
											>
												Two
											</DropdownMenuPrimitive.Item>
											<DropdownMenuPrimitive.Item
												className={itemClass()}
												onSelect={() => console.log("three")}
											>
												Three
											</DropdownMenuPrimitive.Item>
											<DropdownMenuPrimitive.Arrow />
										</DropdownMenuPrimitive.SubContent>
									</DropdownMenuPrimitive.Portal>
								</DropdownMenuPrimitive.Sub>
								<DropdownMenuPrimitive.Separator className={separatorClass()} />
								<DropdownMenuPrimitive.Item
									className={itemClass()}
									disabled
									onSelect={() => console.log("cut")}
								>
									Cut
								</DropdownMenuPrimitive.Item>
								<DropdownMenuPrimitive.Item
									className={itemClass()}
									onSelect={() => console.log("copy")}
								>
									Copy
								</DropdownMenuPrimitive.Item>
								<DropdownMenuPrimitive.Item
									className={itemClass()}
									onSelect={() => console.log("paste")}
								>
									Paste
								</DropdownMenuPrimitive.Item>
								<DropdownMenuPrimitive.Arrow />
							</DropdownMenuPrimitive.Content>
						</DropdownMenuPrimitive.Portal>
					</DropdownMenuPrimitive.Root>
					<textarea
						style={{ width: 500, height: 100, marginTop: 10 }}
						defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet."
					/>
				</div>
			</div>
		</div>
	);
};

export const Submenus = () => {
	const [rtl, setRtl] = useState(false);
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				<label style={{ marginBottom: 10 }}>
					<input
						type="checkbox"
						checked={rtl}
						onChange={(event) => setRtl(event.currentTarget.checked)}
					/>
					Right-to-left
				</label>
				<DropdownMenuPrimitive.Root dir={rtl ? "rtl" : "ltr"}>
					<DropdownMenuPrimitive.Trigger className={triggerClass()}>
						Open
					</DropdownMenuPrimitive.Trigger>
					<DropdownMenuPrimitive.Portal>
						<DropdownMenuPrimitive.Content
							className={contentClass()}
							sideOffset={5}
						>
							<DropdownMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("new-tab")}
							>
								New Tab
							</DropdownMenuPrimitive.Item>
							<DropdownMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("new-window")}
							>
								New Window
							</DropdownMenuPrimitive.Item>
							<DropdownMenuPrimitive.Separator className={separatorClass()} />
							<DropdownMenuPrimitive.Sub>
								<DropdownMenuPrimitive.SubTrigger className={subTriggerClass()}>
									Bookmarks →
								</DropdownMenuPrimitive.SubTrigger>
								<DropdownMenuPrimitive.Portal>
									<DropdownMenuPrimitive.SubContent
										className={contentClass()}
										sideOffset={12}
										alignOffset={-6}
									>
										<DropdownMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("index")}
										>
											Inbox
										</DropdownMenuPrimitive.Item>
										<DropdownMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("calendar")}
										>
											Calendar
										</DropdownMenuPrimitive.Item>
										<DropdownMenuPrimitive.Separator
											className={separatorClass()}
										/>
										<DropdownMenuPrimitive.Sub>
											<DropdownMenuPrimitive.SubTrigger
												className={subTriggerClass()}
											>
												WorkOS →
											</DropdownMenuPrimitive.SubTrigger>
											<DropdownMenuPrimitive.Portal>
												<DropdownMenuPrimitive.SubContent
													className={contentClass()}
													sideOffset={12}
													alignOffset={-6}
												>
													<DropdownMenuPrimitive.Item
														className={itemClass()}
														onSelect={() => console.log("stitches")}
													>
														Stitches
													</DropdownMenuPrimitive.Item>
													<DropdownMenuPrimitive.Item
														className={itemClass()}
														onSelect={() => console.log("composer")}
													>
														Composer
													</DropdownMenuPrimitive.Item>
													<DropdownMenuPrimitive.Item
														className={itemClass()}
														onSelect={() => console.log("squared")}
													>
														Radix
													</DropdownMenuPrimitive.Item>
													<DropdownMenuPrimitive.Arrow />
												</DropdownMenuPrimitive.SubContent>
											</DropdownMenuPrimitive.Portal>
										</DropdownMenuPrimitive.Sub>
										<DropdownMenuPrimitive.Separator
											className={separatorClass()}
										/>
										<DropdownMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("notion")}
										>
											Notion
										</DropdownMenuPrimitive.Item>
										<DropdownMenuPrimitive.Arrow />
									</DropdownMenuPrimitive.SubContent>
								</DropdownMenuPrimitive.Portal>
							</DropdownMenuPrimitive.Sub>
							<DropdownMenuPrimitive.Sub>
								<DropdownMenuPrimitive.SubTrigger
									className={subTriggerClass()}
									disabled
								>
									History →
								</DropdownMenuPrimitive.SubTrigger>
								<DropdownMenuPrimitive.Portal>
									<DropdownMenuPrimitive.SubContent
										className={contentClass()}
										sideOffset={12}
										alignOffset={-6}
									>
										<DropdownMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("github")}
										>
											Github
										</DropdownMenuPrimitive.Item>
										<DropdownMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("google")}
										>
											Google
										</DropdownMenuPrimitive.Item>
										<DropdownMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("stack-overflow")}
										>
											Stack Overflow
										</DropdownMenuPrimitive.Item>
										<DropdownMenuPrimitive.Arrow />
									</DropdownMenuPrimitive.SubContent>
								</DropdownMenuPrimitive.Portal>
							</DropdownMenuPrimitive.Sub>
							<DropdownMenuPrimitive.Sub>
								<DropdownMenuPrimitive.SubTrigger className={subTriggerClass()}>
									Tools →
								</DropdownMenuPrimitive.SubTrigger>
								<DropdownMenuPrimitive.Portal>
									<DropdownMenuPrimitive.SubContent
										className={contentClass()}
										sideOffset={12}
										alignOffset={-6}
									>
										<DropdownMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("extensions")}
										>
											Extensions
										</DropdownMenuPrimitive.Item>
										<DropdownMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("task-manager")}
										>
											Task Manager
										</DropdownMenuPrimitive.Item>
										<DropdownMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("developer-tools")}
										>
											Developer Tools
										</DropdownMenuPrimitive.Item>
										<DropdownMenuPrimitive.Arrow />
									</DropdownMenuPrimitive.SubContent>
								</DropdownMenuPrimitive.Portal>
							</DropdownMenuPrimitive.Sub>
							<DropdownMenuPrimitive.Separator className={separatorClass()} />
							<DropdownMenuPrimitive.Item
								className={itemClass()}
								disabled
								onSelect={() => console.log("print")}
							>
								Print…
							</DropdownMenuPrimitive.Item>
							<DropdownMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("cast")}
							>
								Cast…
							</DropdownMenuPrimitive.Item>
							<DropdownMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("find")}
							>
								Find…
							</DropdownMenuPrimitive.Item>
							<DropdownMenuPrimitive.Arrow />
						</DropdownMenuPrimitive.Content>
					</DropdownMenuPrimitive.Portal>
				</DropdownMenuPrimitive.Root>
			</div>
		</div>
	);
};

export const WithLabels = () => (
	<div style={{ textAlign: "center", padding: 50 }}>
		<DropdownMenuPrimitive.Root>
			<DropdownMenuPrimitive.Trigger className={triggerClass()}>
				Open
			</DropdownMenuPrimitive.Trigger>
			<DropdownMenuPrimitive.Portal>
				<DropdownMenuPrimitive.Content
					className={contentClass()}
					sideOffset={5}
				>
					{foodGroups.map((foodGroup, index) => (
						<DropdownMenuPrimitive.Group key={index}>
							{foodGroup.label && (
								<DropdownMenuPrimitive.Label
									className={labelClass()}
									key={foodGroup.label}
								>
									{foodGroup.label}
								</DropdownMenuPrimitive.Label>
							)}
							{foodGroup.foods.map((food) => (
								<DropdownMenuPrimitive.Item
									key={food.value}
									className={itemClass()}
									disabled={food.disabled}
									onSelect={() => console.log(food.label)}
								>
									{food.label}
								</DropdownMenuPrimitive.Item>
							))}
							{index < foodGroups.length - 1 && (
								<DropdownMenuPrimitive.Separator className={separatorClass()} />
							)}
						</DropdownMenuPrimitive.Group>
					))}
					<DropdownMenuPrimitive.Arrow />
				</DropdownMenuPrimitive.Content>
			</DropdownMenuPrimitive.Portal>
		</DropdownMenuPrimitive.Root>
	</div>
);

export const NestedComposition = () => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
			}}
		>
			<DropdownMenuPrimitive.Root>
				<DropdownMenuPrimitive.Trigger className={triggerClass()}>
					Open
				</DropdownMenuPrimitive.Trigger>
				<DropdownMenuPrimitive.Portal>
					<DropdownMenuPrimitive.Content
						className={contentClass()}
						sideOffset={5}
					>
						<DialogPrimitive.Root>
							<DialogPrimitive.Trigger className={itemClass()} asChild>
								<DropdownMenuPrimitive.Item
									onSelect={(event) => event.preventDefault()}
								>
									Open dialog
								</DropdownMenuPrimitive.Item>
							</DialogPrimitive.Trigger>

							<DialogPrimitive.Portal>
								<DialogPrimitive.Content className={dialogClass()}>
									<DialogPrimitive.Title>Nested dropdown</DialogPrimitive.Title>
									<DropdownMenuPrimitive.Root>
										<DropdownMenuPrimitive.Trigger
											className={triggerClass()}
											style={{
												width: "100%",
												marginBottom: 20,
											}}
										>
											Open
										</DropdownMenuPrimitive.Trigger>
										<DropdownMenuPrimitive.Portal>
											<DropdownMenuPrimitive.Content
												className={contentClass()}
												sideOffset={5}
											>
												<DropdownMenuPrimitive.Item
													className={itemClass()}
													onSelect={() => console.log("undo")}
												>
													Undo
												</DropdownMenuPrimitive.Item>
												<DropdownMenuPrimitive.Item
													className={itemClass()}
													onSelect={() => console.log("redo")}
												>
													Redo
												</DropdownMenuPrimitive.Item>
												<DropdownMenuPrimitive.Arrow />
											</DropdownMenuPrimitive.Content>
										</DropdownMenuPrimitive.Portal>
									</DropdownMenuPrimitive.Root>
									<DialogPrimitive.Close>Close</DialogPrimitive.Close>
								</DialogPrimitive.Content>
							</DialogPrimitive.Portal>
						</DialogPrimitive.Root>
						<DropdownMenuPrimitive.Item className={itemClass()}>
							Test
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Arrow />
					</DropdownMenuPrimitive.Content>
				</DropdownMenuPrimitive.Portal>
			</DropdownMenuPrimitive.Root>
		</div>
	);
};

export const SingleItemAsDialogTrigger = () => {
	const dropdownTriggerRef =
		useRef<ElementRef<typeof DropdownMenuPrimitive.Trigger>>(null);
	const dropdownTriggerRef2 =
		useRef<ElementRef<typeof DropdownMenuPrimitive.Trigger>>(null);
	const isDialogOpenRef = useRef(false);

	function handleModalDialogClose(event: Event) {
		// focus dropdown trigger for accessibility so user doesn't lose their place in the document
		dropdownTriggerRef.current?.focus();
		event.preventDefault();
	}

	function handleNonModalDialogClose(event: Event) {
		// focus dropdown trigger for accessibility so user doesn't lose their place in the document
		dropdownTriggerRef2.current?.focus();
		event.preventDefault();
		isDialogOpenRef.current = false;
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
			}}
		>
			<h1>Modal</h1>
			<DialogPrimitive.Root>
				<DropdownMenuPrimitive.Root>
					<DropdownMenuPrimitive.Trigger
						className={triggerClass()}
						ref={dropdownTriggerRef}
					>
						Open
					</DropdownMenuPrimitive.Trigger>

					<DropdownMenuPrimitive.Portal>
						<DropdownMenuPrimitive.Content
							className={contentClass()}
							sideOffset={5}
						>
							<DialogPrimitive.Trigger className={itemClass()} asChild>
								<DropdownMenuPrimitive.Item>Delete</DropdownMenuPrimitive.Item>
							</DialogPrimitive.Trigger>
							<DropdownMenuPrimitive.Item className={itemClass()}>
								Test
							</DropdownMenuPrimitive.Item>
							<DropdownMenuPrimitive.Arrow />
						</DropdownMenuPrimitive.Content>
					</DropdownMenuPrimitive.Portal>
				</DropdownMenuPrimitive.Root>

				<DialogPrimitive.Content
					className={dialogClass()}
					onCloseAutoFocus={handleModalDialogClose}
				>
					<DialogPrimitive.Title>Are you sure?</DialogPrimitive.Title>
					<DialogPrimitive.Close>Close</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogPrimitive.Root>

			<h1>Non-modal</h1>
			<DialogPrimitive.Root modal={false}>
				<DropdownMenuPrimitive.Root modal={false}>
					<DropdownMenuPrimitive.Trigger
						className={triggerClass()}
						ref={dropdownTriggerRef2}
					>
						Open
					</DropdownMenuPrimitive.Trigger>

					<DropdownMenuPrimitive.Portal>
						<DropdownMenuPrimitive.Content
							className={contentClass()}
							sideOffset={5}
							onCloseAutoFocus={(event) => {
								// prevent focusing dropdown trigger when it closes from a dialog trigger
								if (isDialogOpenRef.current) event.preventDefault();
							}}
						>
							<DialogPrimitive.Trigger className={itemClass()} asChild>
								<DropdownMenuPrimitive.Item
									onSelect={() => {
										isDialogOpenRef.current = true;
									}}
								>
									Delete
								</DropdownMenuPrimitive.Item>
							</DialogPrimitive.Trigger>
							<DropdownMenuPrimitive.Item className={itemClass()}>
								Test
							</DropdownMenuPrimitive.Item>
							<DropdownMenuPrimitive.Arrow />
						</DropdownMenuPrimitive.Content>
					</DropdownMenuPrimitive.Portal>
				</DropdownMenuPrimitive.Root>

				<DialogPrimitive.Content
					className={dialogClass()}
					onCloseAutoFocus={handleNonModalDialogClose}
				>
					<DialogPrimitive.Title>Are you sure?</DialogPrimitive.Title>
					<DialogPrimitive.Close>Close</DialogPrimitive.Close>`
				</DialogPrimitive.Content>
			</DialogPrimitive.Root>
		</div>
	);
};

export const MultipleItemsAsDialogTriggers = () => {
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [switchAccountsOpen, setSwitchAccountsOpen] = useState(false);
	const [deleteOpen2, setDeleteOpen2] = useState(false);
	const [switchAccountsOpen2, setSwitchAccountsOpen2] = useState(false);
	const dropdownTriggerRef =
		useRef<ElementRef<typeof DropdownMenuPrimitive.Trigger>>(null);
	const dropdownTriggerRef2 =
		useRef<ElementRef<typeof DropdownMenuPrimitive.Trigger>>(null);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
			}}
		>
			<h1>Modal</h1>
			<DialogPrimitive.Root
				onOpenChange={(open) => {
					if (!open) {
						setDeleteOpen(false);
						setSwitchAccountsOpen(false);
					}
				}}
			>
				<DropdownMenuPrimitive.Root>
					<DropdownMenuPrimitive.Trigger
						className={triggerClass()}
						ref={dropdownTriggerRef}
					>
						Open
					</DropdownMenuPrimitive.Trigger>

					<DropdownMenuPrimitive.Portal>
						<DropdownMenuPrimitive.Content
							className={contentClass()}
							sideOffset={5}
						>
							<DialogPrimitive.Trigger asChild className={itemClass()}>
								<DropdownMenuPrimitive.Item
									onSelect={() => setSwitchAccountsOpen(true)}
								>
									Switch Accounts
								</DropdownMenuPrimitive.Item>
							</DialogPrimitive.Trigger>
							<DialogPrimitive.Trigger asChild className={itemClass()}>
								<DropdownMenuPrimitive.Item
									onSelect={() => setDeleteOpen(true)}
								>
									Delete
								</DropdownMenuPrimitive.Item>
							</DialogPrimitive.Trigger>
							<DropdownMenuPrimitive.Arrow />
						</DropdownMenuPrimitive.Content>
					</DropdownMenuPrimitive.Portal>
				</DropdownMenuPrimitive.Root>

				<DialogPrimitive.Content
					className={dialogClass()}
					onCloseAutoFocus={(event) => {
						// focus dropdown trigger for accessibility so user doesn't lose their place in the document
						dropdownTriggerRef.current?.focus();
						event.preventDefault();
					}}
				>
					{switchAccountsOpen && (
						<DialogPrimitive.Title>Switch accounts</DialogPrimitive.Title>
					)}
					{deleteOpen && (
						<DialogPrimitive.Title>Are you sure?</DialogPrimitive.Title>
					)}
					<DialogPrimitive.Close>Close</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogPrimitive.Root>

			<h1>Non-modal</h1>
			<DialogPrimitive.Root
				modal={false}
				onOpenChange={(open) => {
					if (!open) {
						setDeleteOpen2(false);
						setSwitchAccountsOpen2(false);
					}
				}}
			>
				<DropdownMenuPrimitive.Root modal={false}>
					<DropdownMenuPrimitive.Trigger
						className={triggerClass()}
						ref={dropdownTriggerRef2}
					>
						Open
					</DropdownMenuPrimitive.Trigger>

					<DropdownMenuPrimitive.Portal>
						<DropdownMenuPrimitive.Content
							className={contentClass()}
							sideOffset={5}
							onCloseAutoFocus={(event) => {
								// prevent focusing dropdown trigger when it closes from a dialog trigger
								if (deleteOpen2 || switchAccountsOpen2) event.preventDefault();
							}}
						>
							<DialogPrimitive.Trigger asChild className={itemClass()}>
								<DropdownMenuPrimitive.Item
									onSelect={() => setSwitchAccountsOpen2(true)}
								>
									Switch Accounts
								</DropdownMenuPrimitive.Item>
							</DialogPrimitive.Trigger>
							<DialogPrimitive.Trigger asChild className={itemClass()}>
								<DropdownMenuPrimitive.Item
									onSelect={() => setDeleteOpen2(true)}
								>
									Delete
								</DropdownMenuPrimitive.Item>
							</DialogPrimitive.Trigger>
							<DropdownMenuPrimitive.Arrow />
						</DropdownMenuPrimitive.Content>
					</DropdownMenuPrimitive.Portal>
				</DropdownMenuPrimitive.Root>

				<DialogPrimitive.Content
					className={dialogClass()}
					onCloseAutoFocus={(event) => {
						// focus dropdown trigger for accessibility so user doesn't lose their place in the document
						dropdownTriggerRef2.current?.focus();
						event.preventDefault();
					}}
				>
					{switchAccountsOpen2 && (
						<DialogPrimitive.Title>Switch accounts</DialogPrimitive.Title>
					)}
					{deleteOpen2 && (
						<DialogPrimitive.Title>Are you sure?</DialogPrimitive.Title>
					)}
					<DialogPrimitive.Close>Close</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogPrimitive.Root>
		</div>
	);
};

export const CheckboxItems = () => {
	const options = ["Crows", "Ravens", "Magpies", "Jackdaws"];

	const [selection, setSelection] = useState<string[]>([]);

	const handleSelectAll = () => {
		setSelection((currentSelection) =>
			currentSelection.length === options.length ? [] : options,
		);
	};

	return (
		<div style={{ textAlign: "center", padding: 50 }}>
			<DropdownMenuPrimitive.Root>
				<DropdownMenuPrimitive.Trigger className={triggerClass()}>
					Open
				</DropdownMenuPrimitive.Trigger>
				<DropdownMenuPrimitive.Portal>
					<DropdownMenuPrimitive.Content
						className={contentClass()}
						sideOffset={5}
					>
						<DropdownMenuPrimitive.Group>
							<DropdownMenuPrimitive.CheckboxItem
								className={itemClass()}
								checked={
									selection.length === options.length
										? true
										: selection.length
											? "indeterminate"
											: false
								}
								onSelect={(e) => e.preventDefault()}
								onCheckedChange={handleSelectAll}
							>
								Select all
								<DropdownMenuPrimitive.ItemIndicator>
									{selection.length === options.length ? <TickIcon /> : "—"}
								</DropdownMenuPrimitive.ItemIndicator>
							</DropdownMenuPrimitive.CheckboxItem>
							<DropdownMenuPrimitive.Separator className={separatorClass()} />
							{options.map((option) => (
								<DropdownMenuPrimitive.CheckboxItem
									key={option}
									className={itemClass()}
									checked={selection.includes(option)}
									onSelect={(e) => e.preventDefault()}
									onCheckedChange={() =>
										setSelection((current) =>
											current.includes(option)
												? current.filter((el) => el !== option)
												: current.concat(option),
										)
									}
								>
									{option}
									<DropdownMenuPrimitive.ItemIndicator>
										<TickIcon />
									</DropdownMenuPrimitive.ItemIndicator>
								</DropdownMenuPrimitive.CheckboxItem>
							))}
						</DropdownMenuPrimitive.Group>
						<DropdownMenuPrimitive.Arrow />
					</DropdownMenuPrimitive.Content>
				</DropdownMenuPrimitive.Portal>
			</DropdownMenuPrimitive.Root>
		</div>
	);
};

export const RadioItems = () => {
	const files = ["README.md", "index.js", "page.css"];
	const [file, setFile] = useState(files[1]);

	return (
		<div style={{ textAlign: "center", padding: 50 }}>
			<DropdownMenuPrimitive.Root>
				<DropdownMenuPrimitive.Trigger className={triggerClass()}>
					Open
				</DropdownMenuPrimitive.Trigger>
				<DropdownMenuPrimitive.Portal>
					<DropdownMenuPrimitive.Content
						className={contentClass()}
						sideOffset={5}
					>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("minimize")}
						>
							Minimize window
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("zoom")}
						>
							Zoom
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("smaller")}
						>
							Smaller
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Separator className={separatorClass()} />
						<DropdownMenuPrimitive.RadioGroup
							value={file}
							onValueChange={setFile}
						>
							{files.map((file) => (
								<DropdownMenuPrimitive.RadioItem
									key={file}
									className={itemClass()}
									value={file}
								>
									{file}
									<DropdownMenuPrimitive.ItemIndicator>
										<TickIcon />
									</DropdownMenuPrimitive.ItemIndicator>
								</DropdownMenuPrimitive.RadioItem>
							))}
						</DropdownMenuPrimitive.RadioGroup>
						<DropdownMenuPrimitive.Arrow />
					</DropdownMenuPrimitive.Content>
				</DropdownMenuPrimitive.Portal>
			</DropdownMenuPrimitive.Root>
			<p>Selected file: {file}</p>
		</div>
	);
};

export const PreventClosing = () => (
	<div style={{ textAlign: "center", padding: 50 }}>
		<DropdownMenuPrimitive.Root>
			<DropdownMenuPrimitive.Trigger className={triggerClass()}>
				Open
			</DropdownMenuPrimitive.Trigger>
			<DropdownMenuPrimitive.Portal>
				<DropdownMenuPrimitive.Content
					className={contentClass()}
					sideOffset={5}
				>
					<DropdownMenuPrimitive.Item
						className={itemClass()}
						onSelect={() => window.alert("action 1")}
					>
						I will close
					</DropdownMenuPrimitive.Item>
					<DropdownMenuPrimitive.Item
						className={itemClass()}
						onSelect={(event) => {
							event.preventDefault();
							window.alert("action 1");
						}}
					>
						I won't close
					</DropdownMenuPrimitive.Item>
					<DropdownMenuPrimitive.Arrow />
				</DropdownMenuPrimitive.Content>
			</DropdownMenuPrimitive.Portal>
		</DropdownMenuPrimitive.Root>
	</div>
);

export const WithTooltip = () => (
	<div
		style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			height: "200vh",
		}}
	>
		<DropdownMenuPrimitive.Root>
			<Tooltip.TooltipProvider>
				<Tooltip.Tooltip>
					<Tooltip.TooltipTrigger asChild>
						<DropdownMenuPrimitive.Trigger className={triggerClass()}>
							Open
						</DropdownMenuPrimitive.Trigger>
					</Tooltip.TooltipTrigger>
					<Tooltip.TooltipContent>Tooltip content</Tooltip.TooltipContent>
				</Tooltip.Tooltip>
			</Tooltip.TooltipProvider>
			<DropdownMenuPrimitive.Portal>
				<DropdownMenuPrimitive.Content
					className={contentClass()}
					sideOffset={5}
				>
					<DropdownMenuPrimitive.Item
						className={itemClass()}
						onSelect={() => console.log("undo")}
					>
						Undo
					</DropdownMenuPrimitive.Item>
					<DropdownMenuPrimitive.Item
						className={itemClass()}
						onSelect={() => console.log("redo")}
					>
						Redo
					</DropdownMenuPrimitive.Item>
					<DropdownMenuPrimitive.Separator className={separatorClass()} />
					<DropdownMenuPrimitive.Item
						className={itemClass()}
						disabled
						onSelect={() => console.log("cut")}
					>
						Cut
					</DropdownMenuPrimitive.Item>
					<DropdownMenuPrimitive.Item
						className={itemClass()}
						onSelect={() => console.log("copy")}
					>
						Copy
					</DropdownMenuPrimitive.Item>
					<DropdownMenuPrimitive.Item
						className={itemClass()}
						onSelect={() => console.log("paste")}
					>
						Paste
					</DropdownMenuPrimitive.Item>
					<DropdownMenuPrimitive.Arrow />
				</DropdownMenuPrimitive.Content>
			</DropdownMenuPrimitive.Portal>
		</DropdownMenuPrimitive.Root>
	</div>
);

export const InPopupWindow = () => {
	const handlePopupClick = useCallback(() => {
		const popupWindow = window.open(
			undefined,
			undefined,
			"width=300,height=300,top=100,left=100",
		);
		if (!popupWindow) {
			console.error(
				"Failed to open popup window, check your popup blocker settings",
			);
			return;
		}

		const containerNode = popupWindow.document.createElement("div");
		popupWindow.document.body.append(containerNode);

		ReactDOM.createRoot(containerNode).render(
			<DropdownMenuPrimitive.Root>
				<DropdownMenuPrimitive.Trigger>Open</DropdownMenuPrimitive.Trigger>
				<DropdownMenuPrimitive.Portal container={containerNode}>
					<DropdownMenuPrimitive.Content>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("undo")}
						>
							Undo
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("redo")}
						>
							Redo
						</DropdownMenuPrimitive.Item>
					</DropdownMenuPrimitive.Content>
				</DropdownMenuPrimitive.Portal>
			</DropdownMenuPrimitive.Root>,
		);
	}, []);
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "200vh",
			}}
		>
			<button onClick={handlePopupClick}>Open Popup</button>
		</div>
	);
};

// change order slightly for more pleasing visual
const sidesArray = Array.from(SIDE_OPTIONS);
const bottomIndex = sidesArray.indexOf("bottom");

if (bottomIndex !== -1) {
	sidesArray.push(...sidesArray.splice(bottomIndex, 1));
}

const SIDES = sidesArray as unknown as typeof SIDE_OPTIONS;

export const Chromatic = () => {
	const checkboxItems = [
		{ label: "Bold", state: useState(false) },
		{ label: "Italic", state: useState(true) },
		{ label: "Underline", state: useState(false) },
		{
			label: "Strikethrough",
			state: useState(false),
			disabled: true,
		},
	];
	const files = ["README.md", "index.js", "page.css"];
	const [file, setFile] = useState(files[1]);

	return (
		<div style={{ padding: 200, paddingBottom: 800 }}>
			<h1>Uncontrolled</h1>
			<h2>Closed</h2>
			<DropdownMenuPrimitive.Root modal={false}>
				<DropdownMenuPrimitive.Trigger className={triggerClass()}>
					Open
				</DropdownMenuPrimitive.Trigger>
				<DropdownMenuPrimitive.Portal>
					<DropdownMenuPrimitive.Content
						className={contentClass()}
						sideOffset={5}
						avoidCollisions={false}
					>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("undo")}
						>
							Undo
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("redo")}
						>
							Redo
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Separator className={separatorClass()} />
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							disabled
							onSelect={() => console.log("cut")}
						>
							Cut
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("copy")}
						>
							Copy
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("paste")}
						>
							Paste
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Arrow />
					</DropdownMenuPrimitive.Content>
				</DropdownMenuPrimitive.Portal>
			</DropdownMenuPrimitive.Root>

			<h2>Open</h2>
			<DropdownMenuPrimitive.Root defaultOpen modal={false}>
				<DropdownMenuPrimitive.Trigger className={triggerClass()}>
					Open
				</DropdownMenuPrimitive.Trigger>
				<DropdownMenuPrimitive.Portal>
					<DropdownMenuPrimitive.Content
						className={contentClass()}
						sideOffset={5}
						avoidCollisions={false}
						onFocusOutside={(event) => event.preventDefault()}
					>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("undo")}
						>
							Undo
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("redo")}
						>
							Redo
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Separator className={separatorClass()} />
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							disabled
							onSelect={() => console.log("cut")}
						>
							Cut
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("copy")}
						>
							Copy
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("paste")}
						>
							Paste
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Arrow />
					</DropdownMenuPrimitive.Content>
				</DropdownMenuPrimitive.Portal>
			</DropdownMenuPrimitive.Root>

			<h2 style={{ marginTop: 180 }}>Open with reordered parts</h2>
			<DropdownMenuPrimitive.Root defaultOpen modal={false}>
				<DropdownMenuPrimitive.Portal>
					<DropdownMenuPrimitive.Content
						className={contentClass()}
						sideOffset={5}
						avoidCollisions={false}
						onFocusOutside={(event) => event.preventDefault()}
					>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("undo")}
						>
							Undo
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("redo")}
						>
							Redo
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Separator className={separatorClass()} />
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							disabled
							onSelect={() => console.log("cut")}
						>
							Cut
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("copy")}
						>
							Copy
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("paste")}
						>
							Paste
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Arrow />
					</DropdownMenuPrimitive.Content>
				</DropdownMenuPrimitive.Portal>
				<DropdownMenuPrimitive.Trigger className={triggerClass()}>
					Open
				</DropdownMenuPrimitive.Trigger>
			</DropdownMenuPrimitive.Root>

			<h1 style={{ marginTop: 200 }}>Controlled</h1>
			<h2>Closed</h2>
			<DropdownMenuPrimitive.Root open={false} modal={false}>
				<DropdownMenuPrimitive.Trigger className={triggerClass()}>
					Open
				</DropdownMenuPrimitive.Trigger>
				<DropdownMenuPrimitive.Portal>
					<DropdownMenuPrimitive.Content
						className={contentClass()}
						sideOffset={5}
						avoidCollisions={false}
					>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("undo")}
						>
							Undo
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("redo")}
						>
							Redo
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Separator className={separatorClass()} />
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							disabled
							onSelect={() => console.log("cut")}
						>
							Cut
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("copy")}
						>
							Copy
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("paste")}
						>
							Paste
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Arrow />
					</DropdownMenuPrimitive.Content>
				</DropdownMenuPrimitive.Portal>
			</DropdownMenuPrimitive.Root>

			<h2>Open</h2>
			<DropdownMenuPrimitive.Root open modal={false}>
				<DropdownMenuPrimitive.Trigger className={triggerClass()}>
					Open
				</DropdownMenuPrimitive.Trigger>
				<DropdownMenuPrimitive.Portal>
					<DropdownMenuPrimitive.Content
						className={contentClass()}
						sideOffset={5}
						avoidCollisions={false}
					>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("undo")}
						>
							Undo
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("redo")}
						>
							Redo
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Separator className={separatorClass()} />
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							disabled
							onSelect={() => console.log("cut")}
						>
							Cut
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("copy")}
						>
							Copy
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("paste")}
						>
							Paste
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Arrow />
					</DropdownMenuPrimitive.Content>
				</DropdownMenuPrimitive.Portal>
			</DropdownMenuPrimitive.Root>

			<h2 style={{ marginTop: 180 }}>Open with reordered parts</h2>
			<DropdownMenuPrimitive.Root open modal={false}>
				<DropdownMenuPrimitive.Portal>
					<DropdownMenuPrimitive.Content
						className={contentClass()}
						sideOffset={5}
						avoidCollisions={false}
					>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("undo")}
						>
							Undo
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("redo")}
						>
							Redo
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Separator className={separatorClass()} />
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							disabled
							onSelect={() => console.log("cut")}
						>
							Cut
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("copy")}
						>
							Copy
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("paste")}
						>
							Paste
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Arrow />
					</DropdownMenuPrimitive.Content>
				</DropdownMenuPrimitive.Portal>
				<DropdownMenuPrimitive.Trigger className={triggerClass()}>
					Open
				</DropdownMenuPrimitive.Trigger>
			</DropdownMenuPrimitive.Root>

			<h1 style={{ marginTop: 200 }}>Submenus</h1>
			<h2>Open</h2>
			<DropdownMenuPrimitive.Root open modal={false}>
				<DropdownMenuPrimitive.Portal>
					<DropdownMenuPrimitive.Content
						className={contentClass()}
						sideOffset={5}
						avoidCollisions={false}
					>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("undo")}
						>
							Undo
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("redo")}
						>
							Redo
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Separator className={separatorClass()} />
						<DropdownMenuPrimitive.Sub open>
							<DropdownMenuPrimitive.SubTrigger className={subTriggerClass()}>
								Submenu →
							</DropdownMenuPrimitive.SubTrigger>
							<DropdownMenuPrimitive.Portal>
								<DropdownMenuPrimitive.SubContent
									className={contentClass()}
									sideOffset={12}
									alignOffset={-6}
									avoidCollisions={false}
								>
									<DropdownMenuPrimitive.Item
										className={itemClass()}
										onSelect={() => console.log("one")}
									>
										One
									</DropdownMenuPrimitive.Item>

									<DropdownMenuPrimitive.Item
										className={itemClass()}
										onSelect={() => console.log("two")}
									>
										Two
									</DropdownMenuPrimitive.Item>
									<DropdownMenuPrimitive.Separator
										className={separatorClass()}
									/>
									<DropdownMenuPrimitive.Sub open>
										<DropdownMenuPrimitive.SubTrigger
											className={subTriggerClass()}
										>
											Submenu →
										</DropdownMenuPrimitive.SubTrigger>
										<DropdownMenuPrimitive.Portal>
											<DropdownMenuPrimitive.SubContent
												className={contentClass()}
												sideOffset={12}
												alignOffset={-6}
												avoidCollisions={false}
											>
												<DropdownMenuPrimitive.Item
													className={itemClass()}
													onSelect={() => console.log("one")}
												>
													One
												</DropdownMenuPrimitive.Item>
												<DropdownMenuPrimitive.Item
													className={itemClass()}
													onSelect={() => console.log("two")}
												>
													Two
												</DropdownMenuPrimitive.Item>
												<DropdownMenuPrimitive.Item
													className={itemClass()}
													onSelect={() => console.log("three")}
												>
													Three
												</DropdownMenuPrimitive.Item>
												<DropdownMenuPrimitive.Arrow />
											</DropdownMenuPrimitive.SubContent>
										</DropdownMenuPrimitive.Portal>
									</DropdownMenuPrimitive.Sub>
									<DropdownMenuPrimitive.Separator
										className={separatorClass()}
									/>
									<DropdownMenuPrimitive.Item
										className={itemClass()}
										onSelect={() => console.log("three")}
									>
										Three
									</DropdownMenuPrimitive.Item>
									<DropdownMenuPrimitive.Arrow />
								</DropdownMenuPrimitive.SubContent>
							</DropdownMenuPrimitive.Portal>
						</DropdownMenuPrimitive.Sub>
						<DropdownMenuPrimitive.Separator className={separatorClass()} />
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							disabled
							onSelect={() => console.log("cut")}
						>
							Cut
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("copy")}
						>
							Copy
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("paste")}
						>
							Paste
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Arrow />
					</DropdownMenuPrimitive.Content>
				</DropdownMenuPrimitive.Portal>
				<DropdownMenuPrimitive.Trigger className={triggerClass()}>
					Open
				</DropdownMenuPrimitive.Trigger>
			</DropdownMenuPrimitive.Root>

			<h2 style={{ marginTop: 275 }}>RTL</h2>
			<div dir="rtl">
				<DropdownMenuPrimitive.Root open dir="rtl" modal={false}>
					<DropdownMenuPrimitive.Portal>
						<DropdownMenuPrimitive.Content
							className={contentClass()}
							sideOffset={5}
							avoidCollisions={false}
						>
							<DropdownMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("undo")}
							>
								Undo
							</DropdownMenuPrimitive.Item>
							<DropdownMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("redo")}
							>
								Redo
							</DropdownMenuPrimitive.Item>
							<DropdownMenuPrimitive.Separator className={separatorClass()} />
							<DropdownMenuPrimitive.Sub open>
								<DropdownMenuPrimitive.SubTrigger className={subTriggerClass()}>
									Submenu →
								</DropdownMenuPrimitive.SubTrigger>
								<DropdownMenuPrimitive.Portal>
									<DropdownMenuPrimitive.SubContent
										className={contentClass()}
										sideOffset={12}
										alignOffset={-6}
										avoidCollisions={false}
									>
										<DropdownMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("one")}
										>
											One
										</DropdownMenuPrimitive.Item>

										<DropdownMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("two")}
										>
											Two
										</DropdownMenuPrimitive.Item>
										<DropdownMenuPrimitive.Separator
											className={separatorClass()}
										/>
										<DropdownMenuPrimitive.Sub open>
											<DropdownMenuPrimitive.SubTrigger
												className={subTriggerClass()}
											>
												Submenu →
											</DropdownMenuPrimitive.SubTrigger>
											<DropdownMenuPrimitive.Portal>
												<DropdownMenuPrimitive.SubContent
													className={contentClass()}
													sideOffset={12}
													alignOffset={-6}
													avoidCollisions={false}
												>
													<DropdownMenuPrimitive.Item
														className={itemClass()}
														onSelect={() => console.log("one")}
													>
														One
													</DropdownMenuPrimitive.Item>
													<DropdownMenuPrimitive.Item
														className={itemClass()}
														onSelect={() => console.log("two")}
													>
														Two
													</DropdownMenuPrimitive.Item>
													<DropdownMenuPrimitive.Item
														className={itemClass()}
														onSelect={() => console.log("three")}
													>
														Three
													</DropdownMenuPrimitive.Item>
													<DropdownMenuPrimitive.Arrow />
												</DropdownMenuPrimitive.SubContent>
											</DropdownMenuPrimitive.Portal>
										</DropdownMenuPrimitive.Sub>
										<DropdownMenuPrimitive.Separator
											className={separatorClass()}
										/>
										<DropdownMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("three")}
										>
											Three
										</DropdownMenuPrimitive.Item>
										<DropdownMenuPrimitive.Arrow />
									</DropdownMenuPrimitive.SubContent>
								</DropdownMenuPrimitive.Portal>
							</DropdownMenuPrimitive.Sub>
							<DropdownMenuPrimitive.Separator className={separatorClass()} />
							<DropdownMenuPrimitive.Item
								className={itemClass()}
								disabled
								onSelect={() => console.log("cut")}
							>
								Cut
							</DropdownMenuPrimitive.Item>
							<DropdownMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("copy")}
							>
								Copy
							</DropdownMenuPrimitive.Item>
							<DropdownMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("paste")}
							>
								Paste
							</DropdownMenuPrimitive.Item>
							<DropdownMenuPrimitive.Arrow />
						</DropdownMenuPrimitive.Content>
					</DropdownMenuPrimitive.Portal>
					<DropdownMenuPrimitive.Trigger className={triggerClass()}>
						Open
					</DropdownMenuPrimitive.Trigger>
				</DropdownMenuPrimitive.Root>
			</div>

			<h1 style={{ marginTop: 275 }}>Positioning</h1>
			<h2>No collisions</h2>
			<h3>Side & Align</h3>
			<div className={gridClass()}>
				{SIDES.map((side) =>
					ALIGN_OPTIONS.map((align) => (
						<DropdownMenuPrimitive.Root
							key={`${side}-${align}`}
							open
							modal={false}
						>
							<DropdownMenuPrimitive.Trigger
								className={chromaticTriggerClass()}
							/>
							<DropdownMenuPrimitive.Portal>
								<DropdownMenuPrimitive.Content
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
									<DropdownMenuPrimitive.Arrow
										className={chromaticArrowClass()}
										width={20}
										height={10}
									/>
								</DropdownMenuPrimitive.Content>
							</DropdownMenuPrimitive.Portal>
						</DropdownMenuPrimitive.Root>
					)),
				)}
			</div>

			<h3>Side offset</h3>
			<h4>Positive</h4>
			<div className={gridClass()}>
				{SIDES.map((side) =>
					ALIGN_OPTIONS.map((align) => (
						<DropdownMenuPrimitive.Root
							key={`${side}-${align}`}
							open
							modal={false}
						>
							<DropdownMenuPrimitive.Trigger
								className={chromaticTriggerClass()}
							/>
							<DropdownMenuPrimitive.Portal>
								<DropdownMenuPrimitive.Content
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
									<DropdownMenuPrimitive.Arrow
										className={chromaticArrowClass()}
										width={20}
										height={10}
									/>
								</DropdownMenuPrimitive.Content>
							</DropdownMenuPrimitive.Portal>
						</DropdownMenuPrimitive.Root>
					)),
				)}
			</div>
			<h4>Negative</h4>
			<div className={gridClass()}>
				{SIDES.map((side) =>
					ALIGN_OPTIONS.map((align) => (
						<DropdownMenuPrimitive.Root
							key={`${side}-${align}`}
							open
							modal={false}
						>
							<DropdownMenuPrimitive.Trigger
								className={chromaticTriggerClass()}
							/>
							<DropdownMenuPrimitive.Portal>
								<DropdownMenuPrimitive.Content
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
									<DropdownMenuPrimitive.Arrow
										className={chromaticArrowClass()}
										width={20}
										height={10}
									/>
								</DropdownMenuPrimitive.Content>
							</DropdownMenuPrimitive.Portal>
						</DropdownMenuPrimitive.Root>
					)),
				)}
			</div>

			<h3>Align offset</h3>
			<h4>Positive</h4>
			<div className={gridClass()}>
				{SIDES.map((side) =>
					ALIGN_OPTIONS.map((align) => (
						<DropdownMenuPrimitive.Root
							key={`${side}-${align}`}
							open
							modal={false}
						>
							<DropdownMenuPrimitive.Trigger
								className={chromaticTriggerClass()}
							/>
							<DropdownMenuPrimitive.Portal>
								<DropdownMenuPrimitive.Content
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
									<DropdownMenuPrimitive.Arrow
										className={chromaticArrowClass()}
										width={20}
										height={10}
									/>
								</DropdownMenuPrimitive.Content>
							</DropdownMenuPrimitive.Portal>
						</DropdownMenuPrimitive.Root>
					)),
				)}
			</div>
			<h4>Negative</h4>
			<div className={gridClass()}>
				{SIDES.map((side) =>
					ALIGN_OPTIONS.map((align) => (
						<DropdownMenuPrimitive.Root
							key={`${side}-${align}`}
							open
							modal={false}
						>
							<DropdownMenuPrimitive.Trigger
								className={chromaticTriggerClass()}
							/>
							<DropdownMenuPrimitive.Portal>
								<DropdownMenuPrimitive.Content
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
									<DropdownMenuPrimitive.Arrow
										className={chromaticArrowClass()}
										width={20}
										height={10}
									/>
								</DropdownMenuPrimitive.Content>
							</DropdownMenuPrimitive.Portal>
						</DropdownMenuPrimitive.Root>
					)),
				)}
			</div>

			<h2>Collisions</h2>
			<p>See instances on the periphery of the page.</p>
			{SIDES.map((side) =>
				ALIGN_OPTIONS.map((align) => (
					<DropdownMenuPrimitive.Root
						key={`${side}-${align}`}
						open
						modal={false}
					>
						<DropdownMenuPrimitive.Trigger
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
						<DropdownMenuPrimitive.Portal>
							<DropdownMenuPrimitive.Content
								className={chromaticContentClass()}
								side={side}
								align={align}
							>
								<p style={{ textAlign: "center" }}>
									{side}
									<br />
									{align}
								</p>
								<DropdownMenuPrimitive.Arrow
									className={chromaticArrowClass()}
									width={20}
									height={10}
								/>
							</DropdownMenuPrimitive.Content>
						</DropdownMenuPrimitive.Portal>
					</DropdownMenuPrimitive.Root>
				)),
			)}

			<h2>Relative parent (non-portalled)</h2>
			<div style={{ position: "relative" }}>
				<DropdownMenuPrimitive.Root open modal={false}>
					<DropdownMenuPrimitive.Trigger className={triggerClass()}>
						Open
					</DropdownMenuPrimitive.Trigger>
					<DropdownMenuPrimitive.Content
						className={contentClass()}
						sideOffset={5}
						avoidCollisions={false}
					>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("undo")}
						>
							Undo
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("redo")}
						>
							Redo
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Arrow />
					</DropdownMenuPrimitive.Content>
				</DropdownMenuPrimitive.Root>
			</div>

			<h1 style={{ marginTop: 100 }}>With labels</h1>
			<DropdownMenuPrimitive.Root open modal={false}>
				<DropdownMenuPrimitive.Trigger className={triggerClass()}>
					Open
				</DropdownMenuPrimitive.Trigger>
				<DropdownMenuPrimitive.Portal>
					<DropdownMenuPrimitive.Content
						className={contentClass()}
						sideOffset={5}
						avoidCollisions={false}
					>
						{foodGroups.map((foodGroup, index) => (
							<DropdownMenuPrimitive.Group key={index}>
								{foodGroup.label && (
									<DropdownMenuPrimitive.Label
										className={labelClass()}
										key={foodGroup.label}
									>
										{foodGroup.label}
									</DropdownMenuPrimitive.Label>
								)}
								{foodGroup.foods.map((food) => (
									<DropdownMenuPrimitive.Item
										key={food.value}
										className={itemClass()}
										disabled={food.disabled}
										onSelect={() => console.log(food.label)}
									>
										{food.label}
									</DropdownMenuPrimitive.Item>
								))}
								{index < foodGroups.length - 1 && (
									<DropdownMenuPrimitive.Separator
										className={separatorClass()}
									/>
								)}
							</DropdownMenuPrimitive.Group>
						))}
						<DropdownMenuPrimitive.Arrow />
					</DropdownMenuPrimitive.Content>
				</DropdownMenuPrimitive.Portal>
			</DropdownMenuPrimitive.Root>

			<h1 style={{ marginTop: 600 }}>With checkbox and radio items</h1>
			<DropdownMenuPrimitive.Root open modal={false}>
				<DropdownMenuPrimitive.Trigger className={triggerClass()}>
					Open
				</DropdownMenuPrimitive.Trigger>
				<DropdownMenuPrimitive.Portal>
					<DropdownMenuPrimitive.Content
						className={contentClass()}
						sideOffset={5}
						avoidCollisions={false}
					>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("show")}
						>
							Show fonts
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("bigger")}
						>
							Bigger
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("smaller")}
						>
							Smaller
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Separator className={separatorClass()} />
						{checkboxItems.map(
							({ label, state: [checked, setChecked], disabled }) => (
								<DropdownMenuPrimitive.CheckboxItem
									key={label}
									className={itemClass()}
									checked={checked}
									onCheckedChange={setChecked}
									disabled={disabled}
								>
									{label}
									<DropdownMenuPrimitive.ItemIndicator>
										<TickIcon />
									</DropdownMenuPrimitive.ItemIndicator>
								</DropdownMenuPrimitive.CheckboxItem>
							),
						)}
						<DropdownMenuPrimitive.Separator className={separatorClass()} />
						<DropdownMenuPrimitive.RadioGroup
							value={file}
							onValueChange={setFile}
						>
							{files.map((file) => (
								<DropdownMenuPrimitive.RadioItem
									key={file}
									className={itemClass()}
									value={file}
								>
									{file}
									<DropdownMenuPrimitive.ItemIndicator>
										<TickIcon />
									</DropdownMenuPrimitive.ItemIndicator>
								</DropdownMenuPrimitive.RadioItem>
							))}
						</DropdownMenuPrimitive.RadioGroup>
						<DropdownMenuPrimitive.Arrow />
					</DropdownMenuPrimitive.Content>
				</DropdownMenuPrimitive.Portal>
			</DropdownMenuPrimitive.Root>

			<h1 style={{ marginTop: 500 }}>Nested composition</h1>

			<DropdownMenuPrimitive.Root open modal={false}>
				<DropdownMenuPrimitive.Trigger className={triggerClass()}>
					Open
				</DropdownMenuPrimitive.Trigger>

				<DropdownMenuPrimitive.Content
					className={contentClass()}
					sideOffset={5}
					avoidCollisions={false}
				>
					<DialogPrimitive.Root open modal={false}>
						<DialogPrimitive.Trigger className={itemClass()} asChild>
							<DropdownMenuPrimitive.Item
								onSelect={(event) => event.preventDefault()}
							>
								Open dialog
							</DropdownMenuPrimitive.Item>
						</DialogPrimitive.Trigger>

						<DialogPrimitive.Content
							style={{
								position: "absolute",
								top: 0,
								left: 150,
								width: 300,
								padding: 20,
								backgroundColor: "whitesmoke",
								border: "1px solid black",
							}}
						>
							<DialogPrimitive.Title style={{ marginTop: 0 }}>
								Dropdown in nested dialog
							</DialogPrimitive.Title>
							<DropdownMenuPrimitive.Root open modal={false}>
								<DropdownMenuPrimitive.Trigger
									className={triggerClass()}
									style={{ width: "100%" }}
								>
									Open
								</DropdownMenuPrimitive.Trigger>
								<DropdownMenuPrimitive.Portal>
									<DropdownMenuPrimitive.Content
										className={contentClass()}
										sideOffset={5}
										avoidCollisions={false}
									>
										<DropdownMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("undo")}
										>
											Undo
										</DropdownMenuPrimitive.Item>
										<DropdownMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("redo")}
										>
											Redo
										</DropdownMenuPrimitive.Item>
										<DropdownMenuPrimitive.Arrow />
									</DropdownMenuPrimitive.Content>
								</DropdownMenuPrimitive.Portal>
							</DropdownMenuPrimitive.Root>
						</DialogPrimitive.Content>
					</DialogPrimitive.Root>
					<DropdownMenuPrimitive.Item className={itemClass()}>
						Test
					</DropdownMenuPrimitive.Item>
					<DropdownMenuPrimitive.Arrow />
				</DropdownMenuPrimitive.Content>
			</DropdownMenuPrimitive.Root>

			<h1 style={{ marginTop: 500 }}>State attributes</h1>
			<h2>Closed</h2>
			<DropdownMenuPrimitive.Root open={false} modal={false}>
				<DropdownMenuPrimitive.Trigger className={triggerAttrClass()}>
					Open
				</DropdownMenuPrimitive.Trigger>
				<DropdownMenuPrimitive.Portal>
					<DropdownMenuPrimitive.Content
						className={contentAttrClass()}
						sideOffset={5}
						avoidCollisions={false}
					/>
				</DropdownMenuPrimitive.Portal>
			</DropdownMenuPrimitive.Root>

			<h2>Open</h2>
			<DropdownMenuPrimitive.Root open modal={false}>
				<DropdownMenuPrimitive.Trigger className={triggerAttrClass()}>
					Open
				</DropdownMenuPrimitive.Trigger>
				<DropdownMenuPrimitive.Portal>
					<DropdownMenuPrimitive.Content
						className={contentAttrClass()}
						sideOffset={5}
						avoidCollisions={false}
					>
						<DropdownMenuPrimitive.Item
							className={itemAttrClass()}
							onSelect={() => console.log("show")}
						>
							Show fonts
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemAttrClass()}
							onSelect={() => console.log("bigger")}
						>
							Bigger
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item
							className={itemAttrClass()}
							onSelect={() => console.log("smaller")}
						>
							Smaller
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Separator className={separatorAttrClass()} />
						{checkboxItems.map(
							({ label, state: [checked, setChecked], disabled }) => (
								<DropdownMenuPrimitive.CheckboxItem
									key={label}
									className={checkboxItemAttrClass()}
									checked={checked}
									onCheckedChange={setChecked}
									disabled={disabled}
								>
									{label}
									<DropdownMenuPrimitive.ItemIndicator
										className={itemIndicatorAttrClass()}
									>
										<TickIcon />
									</DropdownMenuPrimitive.ItemIndicator>
								</DropdownMenuPrimitive.CheckboxItem>
							),
						)}
						<DropdownMenuPrimitive.Separator className={separatorAttrClass()} />
						<DropdownMenuPrimitive.RadioGroup
							className={radioGroupAttrClass()}
							value={file}
							onValueChange={setFile}
						>
							{files.map((file) => (
								<DropdownMenuPrimitive.RadioItem
									key={file}
									className={radioItemAttrClass()}
									value={file}
								>
									{file}
									<DropdownMenuPrimitive.ItemIndicator
										className={itemIndicatorAttrClass()}
									>
										<TickIcon />
									</DropdownMenuPrimitive.ItemIndicator>
								</DropdownMenuPrimitive.RadioItem>
							))}
						</DropdownMenuPrimitive.RadioGroup>
						<DropdownMenuPrimitive.Arrow className={arrowAttrClass()} />
					</DropdownMenuPrimitive.Content>
				</DropdownMenuPrimitive.Portal>
			</DropdownMenuPrimitive.Root>
		</div>
	);
};
Chromatic.parameters = { chromatic: { disable: false } };

const triggerClass = css({
	border: "1px solid $black",
	borderRadius: 6,
	backgroundColor: "transparent",
	padding: "5px 10px",
	fontFamily: "apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif",
	fontSize: 13,

	"&:focus": {
		outline: "none",
		boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.5)",
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

const dialogClass = css({
	position: "fixed",
	background: "white",
	border: "1px solid black",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	padding: 30,
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

	"[data-disabled]": { borderStyle: "dashed" },

	'&[data-state="closed"]': { borderColor: "red" },
	'&[data-state="open"]': { borderColor: "green" },
};
const triggerAttrClass = css(styles);
const contentAttrClass = css(styles);
const itemAttrClass = css(styles);
const itemIndicatorAttrClass = css(styles);
const checkboxItemAttrClass = css(styles);
const radioGroupAttrClass = css(styles);
const radioItemAttrClass = css(styles);
const separatorAttrClass = css(styles);
const arrowAttrClass = css(styles);
