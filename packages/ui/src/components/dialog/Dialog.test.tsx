import type { RenderResult } from "@testing-library/react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import type React from "react";
import type { Mock, MockInstance } from "vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
	Dialog,
	DialogContent,
	DialogOverlay,
	DialogTitle,
	DialogTrigger,
} from ".";

const OPEN_TEXT = "Open";
const TITLE_TEXT = "Title";

const UndefinedDescribedByDialog = (
	props: React.ComponentProps<typeof Dialog>,
) => (
	<Dialog {...props}>
		<DialogTrigger>{OPEN_TEXT}</DialogTrigger>
		<DialogOverlay />
		<DialogContent aria-describedby={undefined}>
			<DialogTitle>{TITLE_TEXT}</DialogTitle>
		</DialogContent>
	</Dialog>
);

const DialogTest = (props: React.ComponentProps<typeof Dialog>) => (
	<Dialog {...props}>
		<DialogTrigger>{OPEN_TEXT}</DialogTrigger>
		<DialogOverlay />
		<DialogContent>
			<DialogTitle>{TITLE_TEXT}</DialogTitle>
		</DialogContent>
	</Dialog>
);

function renderAndClickDialogTrigger(Dialog: any) {
	fireEvent.click(render(Dialog).getByText(OPEN_TEXT));
}

describe("given a default Dialog", () => {
	let rendered: RenderResult;
	let trigger: HTMLElement;
	let closeButton: HTMLElement;
	let consoleWarnMock: MockInstance;
	let consoleWarnMockFunction: Mock;

	beforeEach(() => {
		// This surpresses React error boundary logs for testing intentionally
		// thrown errors, like in some test cases in this suite. See discussion of
		// this here: https://github.com/facebook/react/issues/11098
		consoleWarnMockFunction = vi.fn();
		consoleWarnMock = vi
			.spyOn(console, "warn")
			.mockImplementation(consoleWarnMockFunction);

		rendered = render(<DialogTest />);
		trigger = rendered.getByText(OPEN_TEXT);
	});

	afterEach(() => {
		cleanup();
		consoleWarnMock.mockRestore();
		consoleWarnMockFunction.mockClear();
	});

	it("should have no accessibility violations in default state", async () => {
		expect(await axe(rendered.container)).toHaveNoViolations();
	});

	describe("after clicking the trigger", () => {
		beforeEach(() => {
			fireEvent.click(trigger);
			closeButton = rendered.getByRole("button", {
				name: /close/i,
			});
		});

		describe("when no description has been provided", () => {
			it("should warn to the console", () => {
				expect(consoleWarnMockFunction).toHaveBeenCalledTimes(1);
			});
		});

		describe("when aria-describedby is set to undefined", () => {
			beforeEach(() => {
				cleanup();
			});
			it("should not warn to the console", () => {
				consoleWarnMockFunction.mockClear();

				renderAndClickDialogTrigger(<UndefinedDescribedByDialog />);
				expect(consoleWarnMockFunction).not.toHaveBeenCalled();
			});
		});

		it("should open the content", () => {
			expect(closeButton).toBeVisible();
		});

		it("should have no accessibility violations", async () => {
			expect(await axe(rendered.container)).toHaveNoViolations();
		});

		it("should focus the close button", () => {
			expect(closeButton).toHaveFocus();
		});

		describe("when pressing escape", () => {
			beforeEach(() => {
				fireEvent.keyDown(document.activeElement!, { key: "Escape" });
			});

			it("should close the content", () => {
				expect(closeButton).not.toBeInTheDocument();
			});
		});
	});
});
