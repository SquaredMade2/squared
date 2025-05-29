import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import {
	Tooltip,
	TooltipArrow,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from ".";

describe("Tooltip", () => {
	afterEach(cleanup);

	it("renders tooltip trigger", () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>Tooltip Trigger</TooltipTrigger>
					<TooltipContent>
						Tooltip Content
						<TooltipArrow />
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		);

		expect(screen.getByText("Tooltip Trigger")).toBeInTheDocument();
		expect(screen.queryByText("Tooltip Content")).not.toBeInTheDocument();
	});

	it("renders tooltip content when trigger is hovered", async () => {
		render(
			<TooltipProvider>
				<Tooltip delayDuration={0}>
					<TooltipTrigger>Tooltip Trigger</TooltipTrigger>
					<TooltipContent>
						Tooltip Content
						<TooltipArrow />
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		);

		const trigger = screen.getByText("Tooltip Trigger");
		expect(screen.queryByText("Tooltip Content")).not.toBeInTheDocument();

		userEvent.hover(trigger);
		await waitFor(() => {
			// Get the first instance of the tooltip content because the second is
			// the visually hidden primitive.
			expect(screen.queryAllByText("Tooltip Content")[0]).toBeVisible();
		});
	});

	it("renders tooltip content is dismissed when trigger is clicked", async () => {
		render(
			<TooltipProvider>
				<Tooltip delayDuration={0}>
					<TooltipTrigger>Tooltip Trigger</TooltipTrigger>
					<TooltipContent>
						Tooltip Content
						<TooltipArrow />
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		);

		const trigger = screen.getByText("Tooltip Trigger");
		expect(screen.queryByText("Tooltip Content")).not.toBeInTheDocument();

		userEvent.hover(trigger);
		await waitFor(() => {
			// Get the first instance of the tooltip content because the second is
			// the visually hidden primitive.
			expect(screen.queryAllByText("Tooltip Content")[0]).toBeVisible();
		});

		userEvent.click(trigger);
		await waitFor(() => {
			expect(screen.queryByText("Tooltip Content")).not.toBeInTheDocument();
		});
	});
});
