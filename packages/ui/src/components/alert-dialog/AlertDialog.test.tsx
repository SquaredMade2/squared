import type { RenderResult } from "@testing-library/react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import type React from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { AlertDialogContent } from ".";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./AlertDialog";

const OPEN_TEXT = "Open";
const CANCEL_TEXT = "Cancel";
const ACTION_TEXT = "Do it";
const TITLE_TEXT = "Warning";
const DESC_TEXT = "This is a warning";

const DialogTest = (props: React.ComponentProps<typeof AlertDialog>) => (
	<AlertDialog {...props}>
		<AlertDialogTrigger>{OPEN_TEXT}</AlertDialogTrigger>
		<AlertDialogContent>
			<AlertDialogTitle>{TITLE_TEXT}</AlertDialogTitle>
			<AlertDialogDescription>{DESC_TEXT}</AlertDialogDescription>
			<AlertDialogCancel>{CANCEL_TEXT}</AlertDialogCancel>
			<AlertDialogAction>{ACTION_TEXT}</AlertDialogAction>
		</AlertDialogContent>
	</AlertDialog>
);

describe("given a default Dialog", () => {
	let rendered: RenderResult;
	let title: HTMLElement;
	let trigger: HTMLElement;
	let cancelButton: HTMLElement;

	afterEach(cleanup);

	beforeEach(() => {
		rendered = render(<DialogTest />);
		trigger = rendered.getByText(OPEN_TEXT);
	});

	it("should have no accessibility violations in default state", async () => {
		expect(await axe(rendered.container)).toHaveNoViolations();
	});

	describe("after clicking the trigger", () => {
		beforeEach(() => {
			fireEvent.click(trigger);
			title = rendered.getByText(TITLE_TEXT);
			cancelButton = rendered.getByText(CANCEL_TEXT);
		});

		it("should open the content", () => {
			expect(title).toBeVisible();
		});

		it("should have no accessibility violations when open", async () => {
			expect(await axe(rendered.container)).toHaveNoViolations();
		});

		it("should focus the cancel button", () => {
			expect(cancelButton).toHaveFocus();
		});
	});
});
