;

import * as ContextMenuPrimitive from "../context-menu";

import { useState } from "react";
import { css, keyframes } from "../../stitches.config";
import { foodGroups } from "../../test-data/foods";
import { TickIcon, classes } from "../menu/Menu.stories";

const { contentClass, itemClass, labelClass, separatorClass, subTriggerClass } =
	classes;

export default { title: "Components/ContextMenu" };

export const Styled = () => (
	<div
		style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			width: "200vw",
			height: "200vh",
			gap: 20,
		}}
	>
		<ContextMenuPrimitive.Root>
			<ContextMenuPrimitive.Trigger className={triggerClass()}>
				Right click here
			</ContextMenuPrimitive.Trigger>
			<ContextMenuPrimitive.Portal>
				<ContextMenuPrimitive.Content
					className={contentClass()}
					alignOffset={-5}
				>
					<ContextMenuPrimitive.Item
						className={itemClass()}
						onSelect={() => console.log("undo")}
					>
						Undo
					</ContextMenuPrimitive.Item>
					<ContextMenuPrimitive.Item
						className={itemClass()}
						onSelect={() => console.log("redo")}
					>
						Redo
					</ContextMenuPrimitive.Item>
					<ContextMenuPrimitive.Separator className={separatorClass()} />
					<ContextMenuPrimitive.Item
						className={itemClass()}
						disabled
						onSelect={() => console.log("cut")}
					>
						Cut
					</ContextMenuPrimitive.Item>
					<ContextMenuPrimitive.Item
						className={itemClass()}
						onSelect={() => console.log("copy")}
					>
						Copy
					</ContextMenuPrimitive.Item>
					<ContextMenuPrimitive.Item
						className={itemClass()}
						onSelect={() => console.log("paste")}
					>
						Paste
					</ContextMenuPrimitive.Item>
				</ContextMenuPrimitive.Content>
			</ContextMenuPrimitive.Portal>
		</ContextMenuPrimitive.Root>
	</div>
);

export const Modality = () => (
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
				<ContextMenuPrimitive.Root>
					<ContextMenuPrimitive.Trigger className={triggerClass()} />
					<ContextMenuPrimitive.Portal>
						<ContextMenuPrimitive.Content
							className={contentClass()}
							alignOffset={-5}
						>
							<ContextMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("undo")}
							>
								Undo
							</ContextMenuPrimitive.Item>
							<ContextMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("redo")}
							>
								Redo
							</ContextMenuPrimitive.Item>
							<ContextMenuPrimitive.Separator className={separatorClass()} />
							<ContextMenuPrimitive.Sub>
								<ContextMenuPrimitive.SubTrigger className={subTriggerClass()}>
									Submenu →
								</ContextMenuPrimitive.SubTrigger>
								<ContextMenuPrimitive.Portal>
									<ContextMenuPrimitive.SubContent
										className={contentClass()}
										sideOffset={12}
										alignOffset={-6}
									>
										<ContextMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("one")}
										>
											One
										</ContextMenuPrimitive.Item>
										<ContextMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("two")}
										>
											Two
										</ContextMenuPrimitive.Item>
										<ContextMenuPrimitive.Separator
											className={separatorClass()}
										/>
										<ContextMenuPrimitive.Sub>
											<ContextMenuPrimitive.SubTrigger
												className={subTriggerClass()}
											>
												Submenu →
											</ContextMenuPrimitive.SubTrigger>
											<ContextMenuPrimitive.Portal>
												<ContextMenuPrimitive.SubContent
													className={contentClass()}
													sideOffset={12}
													alignOffset={-6}
												>
													<ContextMenuPrimitive.Item
														className={itemClass()}
														onSelect={() => console.log("one")}
													>
														One
													</ContextMenuPrimitive.Item>
													<ContextMenuPrimitive.Item
														className={itemClass()}
														onSelect={() => console.log("two")}
													>
														Two
													</ContextMenuPrimitive.Item>
													<ContextMenuPrimitive.Item
														className={itemClass()}
														onSelect={() => console.log("three")}
													>
														Three
													</ContextMenuPrimitive.Item>
													<ContextMenuPrimitive.Arrow />
												</ContextMenuPrimitive.SubContent>
											</ContextMenuPrimitive.Portal>
										</ContextMenuPrimitive.Sub>
										<ContextMenuPrimitive.Separator
											className={separatorClass()}
										/>
										<ContextMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("three")}
										>
											Three
										</ContextMenuPrimitive.Item>
										<ContextMenuPrimitive.Arrow />
									</ContextMenuPrimitive.SubContent>
								</ContextMenuPrimitive.Portal>
							</ContextMenuPrimitive.Sub>
							<ContextMenuPrimitive.Separator className={separatorClass()} />
							<ContextMenuPrimitive.Item
								className={itemClass()}
								disabled
								onSelect={() => console.log("cut")}
							>
								Cut
							</ContextMenuPrimitive.Item>
							<ContextMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("copy")}
							>
								Copy
							</ContextMenuPrimitive.Item>
							<ContextMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("paste")}
							>
								Paste
							</ContextMenuPrimitive.Item>
						</ContextMenuPrimitive.Content>
					</ContextMenuPrimitive.Portal>
				</ContextMenuPrimitive.Root>
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
				<ContextMenuPrimitive.Root modal={false}>
					<ContextMenuPrimitive.Trigger className={triggerClass()} />
					<ContextMenuPrimitive.Portal>
						<ContextMenuPrimitive.Content
							className={contentClass()}
							alignOffset={-5}
						>
							<ContextMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("undo")}
							>
								Undo
							</ContextMenuPrimitive.Item>
							<ContextMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("redo")}
							>
								Redo
							</ContextMenuPrimitive.Item>
							<ContextMenuPrimitive.Separator className={separatorClass()} />
							<ContextMenuPrimitive.Sub>
								<ContextMenuPrimitive.SubTrigger className={subTriggerClass()}>
									Submenu →
								</ContextMenuPrimitive.SubTrigger>
								<ContextMenuPrimitive.Portal>
									<ContextMenuPrimitive.SubContent
										className={contentClass()}
										sideOffset={12}
										alignOffset={-6}
									>
										<ContextMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("one")}
										>
											One
										</ContextMenuPrimitive.Item>
										<ContextMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("two")}
										>
											Two
										</ContextMenuPrimitive.Item>
										<ContextMenuPrimitive.Separator
											className={separatorClass()}
										/>
										<ContextMenuPrimitive.Sub>
											<ContextMenuPrimitive.SubTrigger
												className={subTriggerClass()}
											>
												Submenu →
											</ContextMenuPrimitive.SubTrigger>
											<ContextMenuPrimitive.Portal>
												<ContextMenuPrimitive.SubContent
													className={contentClass()}
													sideOffset={12}
													alignOffset={-6}
												>
													<ContextMenuPrimitive.Item
														className={itemClass()}
														onSelect={() => console.log("one")}
													>
														One
													</ContextMenuPrimitive.Item>
													<ContextMenuPrimitive.Item
														className={itemClass()}
														onSelect={() => console.log("two")}
													>
														Two
													</ContextMenuPrimitive.Item>
													<ContextMenuPrimitive.Item
														className={itemClass()}
														onSelect={() => console.log("three")}
													>
														Three
													</ContextMenuPrimitive.Item>
													<ContextMenuPrimitive.Arrow />
												</ContextMenuPrimitive.SubContent>
											</ContextMenuPrimitive.Portal>
										</ContextMenuPrimitive.Sub>
										<ContextMenuPrimitive.Separator
											className={separatorClass()}
										/>
										<ContextMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("three")}
										>
											Three
										</ContextMenuPrimitive.Item>
										<ContextMenuPrimitive.Arrow />
									</ContextMenuPrimitive.SubContent>
								</ContextMenuPrimitive.Portal>
							</ContextMenuPrimitive.Sub>
							<ContextMenuPrimitive.Separator className={separatorClass()} />
							<ContextMenuPrimitive.Item
								className={itemClass()}
								disabled
								onSelect={() => console.log("cut")}
							>
								Cut
							</ContextMenuPrimitive.Item>
							<ContextMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("copy")}
							>
								Copy
							</ContextMenuPrimitive.Item>
							<ContextMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("paste")}
							>
								Paste
							</ContextMenuPrimitive.Item>
						</ContextMenuPrimitive.Content>
					</ContextMenuPrimitive.Portal>
				</ContextMenuPrimitive.Root>
				<textarea
					style={{ width: 500, height: 100, marginTop: 10 }}
					defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet."
				/>
			</div>
		</div>
	</div>
);

export const Submenus = () => {
	const [rtl, setRtl] = useState(false);

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
				gap: 20,
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
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
				<ContextMenuPrimitive.Root dir={rtl ? "rtl" : "ltr"}>
					<ContextMenuPrimitive.Trigger className={triggerClass()}>
						Right Click Here
					</ContextMenuPrimitive.Trigger>
					<ContextMenuPrimitive.Portal>
						<ContextMenuPrimitive.Content className={contentClass()}>
							<ContextMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("new-tab")}
							>
								New Tab
							</ContextMenuPrimitive.Item>
							<ContextMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("new-window")}
							>
								New Window
							</ContextMenuPrimitive.Item>
							<ContextMenuPrimitive.Separator className={separatorClass()} />
							<ContextMenuPrimitive.Sub>
								<ContextMenuPrimitive.SubTrigger className={subTriggerClass()}>
									Bookmarks →
								</ContextMenuPrimitive.SubTrigger>
								<ContextMenuPrimitive.Portal>
									<ContextMenuPrimitive.SubContent
										className={contentClass()}
										sideOffset={12}
										alignOffset={-6}
									>
										<ContextMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("index")}
										>
											Inbox
										</ContextMenuPrimitive.Item>
										<ContextMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("calendar")}
										>
											Calendar
										</ContextMenuPrimitive.Item>
										<ContextMenuPrimitive.Separator
											className={separatorClass()}
										/>
										<ContextMenuPrimitive.Sub>
											<ContextMenuPrimitive.SubTrigger
												className={subTriggerClass()}
											>
												WorkOS →
											</ContextMenuPrimitive.SubTrigger>
											<ContextMenuPrimitive.Portal>
												<ContextMenuPrimitive.SubContent
													className={contentClass()}
													sideOffset={12}
													alignOffset={-6}
												>
													<ContextMenuPrimitive.Item
														className={itemClass()}
														onSelect={() => console.log("stitches")}
													>
														Stitches
													</ContextMenuPrimitive.Item>
													<ContextMenuPrimitive.Item
														className={itemClass()}
														onSelect={() => console.log("composer")}
													>
														Composer
													</ContextMenuPrimitive.Item>
													<ContextMenuPrimitive.Item
														className={itemClass()}
														onSelect={() => console.log("squared")}
													>
														Radix
													</ContextMenuPrimitive.Item>
													<ContextMenuPrimitive.Arrow />
												</ContextMenuPrimitive.SubContent>
											</ContextMenuPrimitive.Portal>
										</ContextMenuPrimitive.Sub>
										<ContextMenuPrimitive.Separator
											className={separatorClass()}
										/>
										<ContextMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("notion")}
										>
											Notion
										</ContextMenuPrimitive.Item>
										<ContextMenuPrimitive.Arrow />
									</ContextMenuPrimitive.SubContent>
								</ContextMenuPrimitive.Portal>
							</ContextMenuPrimitive.Sub>
							<ContextMenuPrimitive.Sub>
								<ContextMenuPrimitive.SubTrigger
									className={subTriggerClass()}
									disabled
								>
									History →
								</ContextMenuPrimitive.SubTrigger>
								<ContextMenuPrimitive.Portal>
									<ContextMenuPrimitive.SubContent
										className={contentClass()}
										sideOffset={12}
										alignOffset={-6}
									>
										<ContextMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("github")}
										>
											Github
										</ContextMenuPrimitive.Item>
										<ContextMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("google")}
										>
											Google
										</ContextMenuPrimitive.Item>
										<ContextMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("stack-overflow")}
										>
											Stack Overflow
										</ContextMenuPrimitive.Item>
										<ContextMenuPrimitive.Arrow />
									</ContextMenuPrimitive.SubContent>
								</ContextMenuPrimitive.Portal>
							</ContextMenuPrimitive.Sub>
							<ContextMenuPrimitive.Sub>
								<ContextMenuPrimitive.SubTrigger className={subTriggerClass()}>
									Tools →
								</ContextMenuPrimitive.SubTrigger>
								<ContextMenuPrimitive.Portal>
									<ContextMenuPrimitive.SubContent
										className={contentClass()}
										sideOffset={12}
										alignOffset={-6}
									>
										<ContextMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("extensions")}
										>
											Extensions
										</ContextMenuPrimitive.Item>
										<ContextMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("task-manager")}
										>
											Task Manager
										</ContextMenuPrimitive.Item>
										<ContextMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("developer-tools")}
										>
											Developer Tools
										</ContextMenuPrimitive.Item>
										<ContextMenuPrimitive.Arrow />
									</ContextMenuPrimitive.SubContent>
								</ContextMenuPrimitive.Portal>
							</ContextMenuPrimitive.Sub>
							<ContextMenuPrimitive.Separator className={separatorClass()} />
							<ContextMenuPrimitive.Item
								className={itemClass()}
								disabled
								onSelect={() => console.log("print")}
							>
								Print…
							</ContextMenuPrimitive.Item>
							<ContextMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("cast")}
							>
								Cast…
							</ContextMenuPrimitive.Item>
							<ContextMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("find")}
							>
								Find…
							</ContextMenuPrimitive.Item>
						</ContextMenuPrimitive.Content>
					</ContextMenuPrimitive.Portal>
				</ContextMenuPrimitive.Root>
			</div>
		</div>
	);
};

export const WithLabels = () => (
	<div style={{ textAlign: "center", padding: 50 }}>
		<ContextMenuPrimitive.Root>
			<ContextMenuPrimitive.Trigger className={triggerClass()}>
				Right click here
			</ContextMenuPrimitive.Trigger>
			<ContextMenuPrimitive.Portal>
				<ContextMenuPrimitive.Content
					className={contentClass()}
					alignOffset={-5}
				>
					{foodGroups.map((foodGroup, index) => (
						<ContextMenuPrimitive.Group key={index}>
							{foodGroup.label && (
								<ContextMenuPrimitive.Label
									className={labelClass()}
									key={foodGroup.label}
								>
									{foodGroup.label}
								</ContextMenuPrimitive.Label>
							)}
							{foodGroup.foods.map((food) => (
								<ContextMenuPrimitive.Item
									key={food.value}
									className={itemClass()}
									disabled={food.disabled}
									onSelect={() => console.log(food.label)}
								>
									{food.label}
								</ContextMenuPrimitive.Item>
							))}
							{index < foodGroups.length - 1 && (
								<ContextMenuPrimitive.Separator className={separatorClass()} />
							)}
						</ContextMenuPrimitive.Group>
					))}
				</ContextMenuPrimitive.Content>
			</ContextMenuPrimitive.Portal>
		</ContextMenuPrimitive.Root>
	</div>
);

export const CheckboxItems = () => {
	const checkboxItems = ["Bold", "Italic", "Underline"];
	const [selection, setSelection] = useState<string[]>([]);

	return (
		<div style={{ textAlign: "center", padding: 50 }}>
			<ContextMenuPrimitive.Root>
				<ContextMenuPrimitive.Trigger className={triggerClass()}>
					Right click here
				</ContextMenuPrimitive.Trigger>
				<ContextMenuPrimitive.Portal>
					<ContextMenuPrimitive.Content
						className={contentClass()}
						alignOffset={-5}
					>
						<ContextMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("show")}
						>
							Show fonts
						</ContextMenuPrimitive.Item>
						<ContextMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("bigger")}
						>
							Bigger
						</ContextMenuPrimitive.Item>
						<ContextMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("smaller")}
						>
							Smaller
						</ContextMenuPrimitive.Item>
						<ContextMenuPrimitive.Separator className={separatorClass()} />
						{checkboxItems.map((item) => (
							<ContextMenuPrimitive.CheckboxItem
								key={item}
								className={itemClass()}
								checked={selection.includes(item)}
								onCheckedChange={() =>
									setSelection((current) =>
										current.includes(item)
											? current.filter((el) => el !== item)
											: current.concat(item),
									)
								}
							>
								{item}
								<ContextMenuPrimitive.ItemIndicator>
									<TickIcon />
								</ContextMenuPrimitive.ItemIndicator>
							</ContextMenuPrimitive.CheckboxItem>
						))}
						<ContextMenuPrimitive.Separator />
						<ContextMenuPrimitive.CheckboxItem className={itemClass()} disabled>
							Strikethrough
							<ContextMenuPrimitive.ItemIndicator>
								<TickIcon />
							</ContextMenuPrimitive.ItemIndicator>
						</ContextMenuPrimitive.CheckboxItem>
					</ContextMenuPrimitive.Content>
				</ContextMenuPrimitive.Portal>
			</ContextMenuPrimitive.Root>
		</div>
	);
};

export const RadioItems = () => {
	const files = ["README.md", "index.js", "page.css"];
	const [file, setFile] = useState(files[1]);

	return (
		<div style={{ textAlign: "center", padding: 50 }}>
			<ContextMenuPrimitive.Root>
				<ContextMenuPrimitive.Trigger className={triggerClass()}>
					Right click here
				</ContextMenuPrimitive.Trigger>
				<ContextMenuPrimitive.Portal>
					<ContextMenuPrimitive.Content
						className={contentClass()}
						alignOffset={-5}
					>
						<ContextMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("minimize")}
						>
							Minimize window
						</ContextMenuPrimitive.Item>
						<ContextMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("zoom")}
						>
							Zoom
						</ContextMenuPrimitive.Item>
						<ContextMenuPrimitive.Item
							className={itemClass()}
							onSelect={() => console.log("smaller")}
						>
							Smaller
						</ContextMenuPrimitive.Item>
						<ContextMenuPrimitive.Separator className={separatorClass()} />
						<ContextMenuPrimitive.RadioGroup
							value={file}
							onValueChange={setFile}
						>
							{files.map((file) => (
								<ContextMenuPrimitive.RadioItem
									key={file}
									className={itemClass()}
									value={file}
								>
									{file}
									<ContextMenuPrimitive.ItemIndicator>
										<TickIcon />
									</ContextMenuPrimitive.ItemIndicator>
								</ContextMenuPrimitive.RadioItem>
							))}
						</ContextMenuPrimitive.RadioGroup>
					</ContextMenuPrimitive.Content>
				</ContextMenuPrimitive.Portal>
			</ContextMenuPrimitive.Root>
			<p>Selected file: {file}</p>
		</div>
	);
};

export const PreventClosing = () => (
	<div style={{ textAlign: "center", padding: 50 }}>
		<ContextMenuPrimitive.Root>
			<ContextMenuPrimitive.Trigger className={triggerClass()}>
				Right click here
			</ContextMenuPrimitive.Trigger>
			<ContextMenuPrimitive.Portal>
				<ContextMenuPrimitive.Content
					className={contentClass()}
					alignOffset={-5}
				>
					<ContextMenuPrimitive.Item
						className={itemClass()}
						onSelect={() => window.alert("action 1")}
					>
						I will close
					</ContextMenuPrimitive.Item>
					<ContextMenuPrimitive.Item
						className={itemClass()}
						onSelect={(event) => {
							event.preventDefault();
							window.alert("action 1");
						}}
					>
						I won't close
					</ContextMenuPrimitive.Item>
				</ContextMenuPrimitive.Content>
			</ContextMenuPrimitive.Portal>
		</ContextMenuPrimitive.Root>
	</div>
);

export const Multiple = () => {
	const [customColors, setCustomColors] = useState<{
		[index: number]: string;
	}>({});
	const [fadedIndexes, setFadedIndexes] = useState<number[]>([]);
	return (
		<div
			style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
			onContextMenu={(event) => event.preventDefault()}
		>
			{Array.from({ length: 100 }, (_, i) => {
				const customColor = customColors[i];
				return (
					<ContextMenuPrimitive.Root key={i}>
						<ContextMenuPrimitive.Portal>
							<ContextMenuPrimitive.Content
								className={animatedContentClass()}
								alignOffset={-5}
							>
								<ContextMenuPrimitive.Label className={labelClass()}>
									Color
								</ContextMenuPrimitive.Label>
								<ContextMenuPrimitive.RadioGroup
									value={customColor}
									onValueChange={(color) =>
										setCustomColors((colors) => ({
											...colors,
											[i]: color,
										}))
									}
								>
									<ContextMenuPrimitive.RadioItem
										className={itemClass()}
										value="royalblue"
									>
										Blue
										<ContextMenuPrimitive.ItemIndicator>
											<TickIcon />
										</ContextMenuPrimitive.ItemIndicator>
									</ContextMenuPrimitive.RadioItem>
									<ContextMenuPrimitive.RadioItem
										className={itemClass()}
										value="tomato"
									>
										Red
										<ContextMenuPrimitive.ItemIndicator>
											<TickIcon />
										</ContextMenuPrimitive.ItemIndicator>
									</ContextMenuPrimitive.RadioItem>
								</ContextMenuPrimitive.RadioGroup>
								<ContextMenuPrimitive.Separator className={separatorClass()} />
								<ContextMenuPrimitive.CheckboxItem
									className={itemClass()}
									checked={fadedIndexes.includes(i)}
									onCheckedChange={(faded) =>
										setFadedIndexes((indexes) =>
											faded
												? [...indexes, i]
												: indexes.filter((index) => index !== i),
										)
									}
								>
									Fade
									<ContextMenuPrimitive.ItemIndicator>
										<TickIcon />
									</ContextMenuPrimitive.ItemIndicator>
								</ContextMenuPrimitive.CheckboxItem>
							</ContextMenuPrimitive.Content>
						</ContextMenuPrimitive.Portal>
						<ContextMenuPrimitive.Trigger>
							<div
								style={{
									flexShrink: 0,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									width: 100,
									height: 100,
									backgroundColor: customColor ? customColor : "#eeeef0",
									color: customColor ? "white" : "#666670",
									fontSize: 32,
									borderRadius: 5,
									cursor: "default",
									userSelect: "none",
									opacity: fadedIndexes.includes(i) ? 0.5 : 1,
								}}
							>
								{i + 1}
							</div>
						</ContextMenuPrimitive.Trigger>
					</ContextMenuPrimitive.Root>
				);
			})}
		</div>
	);
};

export const Nested = () => (
	<div
		style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		}}
	>
		<ContextMenuPrimitive.Root>
			<ContextMenuPrimitive.Trigger
				className={triggerClass()}
				style={{ padding: 100, backgroundColor: "royalblue" }}
			>
				<ContextMenuPrimitive.Root>
					<ContextMenuPrimitive.Trigger
						className={triggerClass()}
						style={{ backgroundColor: "tomato" }}
					/>{" "}
					<ContextMenuPrimitive.Portal>
						<ContextMenuPrimitive.Content
							className={contentClass()}
							alignOffset={-5}
						>
							<ContextMenuPrimitive.Label className={labelClass()}>
								Red box menu
							</ContextMenuPrimitive.Label>
							<ContextMenuPrimitive.Separator className={separatorClass()} />
							<ContextMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("red action1")}
							>
								Red action 1
							</ContextMenuPrimitive.Item>
							<ContextMenuPrimitive.Item
								className={itemClass()}
								onSelect={() => console.log("red action2")}
							>
								Red action 2
							</ContextMenuPrimitive.Item>
							<ContextMenuPrimitive.Separator className={separatorClass()} />
							<ContextMenuPrimitive.Sub>
								<ContextMenuPrimitive.SubTrigger className={subTriggerClass()}>
									Submenu →
								</ContextMenuPrimitive.SubTrigger>
								<ContextMenuPrimitive.Portal>
									<ContextMenuPrimitive.SubContent
										className={contentClass()}
										sideOffset={12}
										alignOffset={-6}
									>
										<ContextMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("red sub action 1")}
										>
											Red sub action 1
										</ContextMenuPrimitive.Item>
										<ContextMenuPrimitive.Item
											className={itemClass()}
											onSelect={() => console.log("red sub action 2")}
										>
											Red sub action 2
										</ContextMenuPrimitive.Item>
										<ContextMenuPrimitive.Arrow />
									</ContextMenuPrimitive.SubContent>
								</ContextMenuPrimitive.Portal>
							</ContextMenuPrimitive.Sub>
						</ContextMenuPrimitive.Content>
					</ContextMenuPrimitive.Portal>
				</ContextMenuPrimitive.Root>
			</ContextMenuPrimitive.Trigger>
			<ContextMenuPrimitive.Portal>
				<ContextMenuPrimitive.Content
					className={contentClass()}
					alignOffset={-5}
				>
					<ContextMenuPrimitive.Label className={labelClass()}>
						Blue box menu
					</ContextMenuPrimitive.Label>
					<ContextMenuPrimitive.Separator className={separatorClass()} />
					<ContextMenuPrimitive.Item
						className={itemClass()}
						onSelect={() => console.log("blue action1")}
					>
						Blue action 1
					</ContextMenuPrimitive.Item>
					<ContextMenuPrimitive.Item
						className={itemClass()}
						onSelect={() => console.log("blue action2")}
					>
						Blue action 2
					</ContextMenuPrimitive.Item>
					<ContextMenuPrimitive.Separator className={separatorClass()} />
					<ContextMenuPrimitive.Sub>
						<ContextMenuPrimitive.SubTrigger className={subTriggerClass()}>
							Submenu →
						</ContextMenuPrimitive.SubTrigger>
						<ContextMenuPrimitive.Portal>
							<ContextMenuPrimitive.SubContent
								className={contentClass()}
								sideOffset={12}
								alignOffset={-6}
							>
								<ContextMenuPrimitive.Item
									className={itemClass()}
									onSelect={() => console.log("blue sub action 1")}
								>
									Blue sub action 1
								</ContextMenuPrimitive.Item>
								<ContextMenuPrimitive.Item
									className={itemClass()}
									onSelect={() => console.log("blue sub action 2")}
								>
									Blue sub action 2
								</ContextMenuPrimitive.Item>
								<ContextMenuPrimitive.Arrow />
							</ContextMenuPrimitive.SubContent>
						</ContextMenuPrimitive.Portal>
					</ContextMenuPrimitive.Sub>
				</ContextMenuPrimitive.Content>
			</ContextMenuPrimitive.Portal>
		</ContextMenuPrimitive.Root>
	</div>
);

const triggerClass = css({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 200,
	height: 100,
	border: "2px dashed $black",
	borderRadius: 6,
	backgroundColor: "rgba(0, 0, 0, 0.1)",

	"&:focus": {
		outline: "none",
		boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.5)",
	},

	'&[data-state="open"]': {
		backgroundColor: "lightblue",
	},
});

const scaleIn = keyframes({
	"0%": { transform: "scale(0) rotateZ(-10deg)" },
	"20%": { transform: "scale(1.1)" },
	"100%": { transform: "scale(1)" },
});

const animatedContentClass = css(contentClass, {
	transformOrigin: "var(--squared-context-menu-content-transform-origin)",
	'&[data-state="open"]': {
		animation: `${scaleIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
	},
});
