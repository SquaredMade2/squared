import { Label as LabelPrimitive } from "../label";
import * as SwitchPrimitive from "../switch";

import { useState } from "react";
import { css } from "../../stitches.config";
import { RECOMMENDED_CSS__LABEL__ROOT } from "../label/Label.stories";

export default { title: "Components/Switch" };

export const Styled = () => (
	<>
		<p>This switch is nested inside a label. The state is uncontrolled.</p>
		<Label>
			This is the label{" "}
			<SwitchPrimitive.Root className={rootClass()}>
				<SwitchPrimitive.Thumb className={thumbClass()} />
			</SwitchPrimitive.Root>
		</Label>
	</>
);

export const Controlled = () => {
	const [checked, setChecked] = useState(true);

	return (
		<>
			<p>
				This switch is placed adjacent to its label. The state is controlled.
			</p>
			<Label htmlFor="randBox">This is the label</Label>{" "}
			<SwitchPrimitive.Root
				className={rootClass()}
				checked={checked}
				onCheckedChange={setChecked}
				id="randBox"
			>
				<SwitchPrimitive.Thumb className={thumbClass()} />
			</SwitchPrimitive.Root>
		</>
	);
};

export const WithinForm = () => {
	const [data, setData] = useState({
		optional: false,
		required: false,
		stopprop: false,
	});
	const [checked, setChecked] = useState(false);

	return (
		<form
			onSubmit={(event) => event.preventDefault()}
			onChange={(event) => {
				const input = event.target as HTMLInputElement;
				setData((prevData) => ({
					...prevData,
					[input.name]: input.checked,
				}));
			}}
		>
			<fieldset>
				<legend>optional checked: {String(data.optional)}</legend>
				<label htmlFor="optionalSwitch">
					<SwitchPrimitive.Root
						className={rootClass()}
						name="optional"
						checked={checked}
						onCheckedChange={setChecked}
						id="optionalSwitch"
					>
						<SwitchPrimitive.Thumb className={thumbClass()} />
					</SwitchPrimitive.Root>{" "}
					with label
				</label>
			</fieldset>

			<br />
			<br />

			<fieldset>
				<legend>required checked: {String(data.required)}</legend>
				<SwitchPrimitive.Root className={rootClass()} name="required" required>
					<SwitchPrimitive.Thumb className={thumbClass()} />
				</SwitchPrimitive.Root>
			</fieldset>

			<br />
			<br />

			<fieldset>
				<legend>stop propagation checked: {String(data.stopprop)}</legend>
				<SwitchPrimitive.Root
					className={rootClass()}
					name="stopprop"
					onClick={(event) => event.stopPropagation()}
				>
					<SwitchPrimitive.Thumb className={thumbClass()} />
				</SwitchPrimitive.Root>
			</fieldset>

			<br />
			<br />

			<button>Submit</button>
		</form>
	);
};

export const Chromatic = () => (
	<>
		<h1>Uncontrolled</h1>
		<h2>Off</h2>
		<SwitchPrimitive.Root className={rootClass()}>
			<SwitchPrimitive.Thumb className={thumbClass()} />
		</SwitchPrimitive.Root>

		<h2>On</h2>
		<SwitchPrimitive.Root className={rootClass()} defaultChecked>
			<SwitchPrimitive.Thumb className={thumbClass()} />
		</SwitchPrimitive.Root>

		<h1>Controlled</h1>
		<h2>Off</h2>
		<SwitchPrimitive.Root className={rootClass()} checked={false}>
			<SwitchPrimitive.Thumb className={thumbClass()} />
		</SwitchPrimitive.Root>

		<h2>On</h2>
		<SwitchPrimitive.Root className={rootClass()} checked>
			<SwitchPrimitive.Thumb className={thumbClass()} />
		</SwitchPrimitive.Root>

		<h1>Disabled</h1>
		<SwitchPrimitive.Root className={rootClass()} disabled>
			<SwitchPrimitive.Thumb className={thumbClass()} />
		</SwitchPrimitive.Root>

		<h1>State attributes</h1>
		<h2>Unchecked</h2>
		<SwitchPrimitive.Root className={rootAttrClass()}>
			<SwitchPrimitive.Thumb className={thumbAttrClass()} />
		</SwitchPrimitive.Root>

		<h2>Checked</h2>
		<SwitchPrimitive.Root className={rootAttrClass()} defaultChecked>
			<SwitchPrimitive.Thumb className={thumbAttrClass()} />
		</SwitchPrimitive.Root>

		<h2>Disabled</h2>
		<SwitchPrimitive.Root className={rootAttrClass()} defaultChecked disabled>
			<SwitchPrimitive.Thumb className={thumbAttrClass()} />
		</SwitchPrimitive.Root>
	</>
);
Chromatic.parameters = { chromatic: { disable: false } };

const Label = (props: any) => (
	<LabelPrimitive {...props} style={RECOMMENDED_CSS__LABEL__ROOT} />
);

const WIDTH = 50;
const THUMB_WIDTH = 20;
const GAP = 4;

const RECOMMENDED_CSS__SWITCH__ROOT: any = {
	// better default alignment
	verticalAlign: "middle",
	// ensures thumb is not horizontally centered (default in `button`)
	textAlign: "left",
};

const rootClass = css({
	...RECOMMENDED_CSS__SWITCH__ROOT,
	outline: "none",
	border: "none",
	width: WIDTH,
	padding: GAP,
	borderRadius: "9999px",
	backgroundColor: "$gray300",
	transition: "background-color 166ms ease-out",

	"&:focus": {
		outline: "none",
		boxShadow: "0 0 0 2px $colors$black",
	},

	'&[data-state="checked"]': {
		backgroundColor: "$red",
		borderColor: "$red",
	},

	"&[data-disabled]": { opacity: 0.5 },
});

const RECOMMENDED_CSS__SWITCH__THUMB = {
	// ensures thumb is sizeable/can receive vertical margins
	display: "inline-block",
	// ensures thumb is vertically centered
	verticalAlign: "middle",
};

const thumbClass = css({
	...RECOMMENDED_CSS__SWITCH__THUMB,
	width: THUMB_WIDTH,
	height: THUMB_WIDTH,
	backgroundColor: "$white",
	borderRadius: "9999px",
	transition: "transform 166ms ease-out",
	'&[data-state="checked"]': {
		transform: `translateX(${WIDTH - GAP * 2 - THUMB_WIDTH}px)`,
	},
});

const styles = {
	backgroundColor: "rgba(0, 0, 255, 0.3)",
	border: "2px solid blue",
	padding: 10,

	'&[data-state="unchecked"]': { borderColor: "red" },
	'&[data-state="checked"]': { borderColor: "green" },
	'&[data-state="indeterminate"]': { borderColor: "purple" },
	"&[data-disabled]": { borderStyle: "dashed" },
	"&:disabled": { opacity: 0.5 },
};
const rootAttrClass = css(styles);
const thumbAttrClass = css(styles);
