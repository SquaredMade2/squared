import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import TopNavBarDisplay from ".";
import { useViewStore } from "@/store";

jest.mock("@/store", () => ({
	useViewStore: jest.fn(),
}));

// Mock UI components (unchanged)

describe("TopNavBarDisplay", () => {
	const mockSetView = jest.fn();
	const mockSetListViewOptions = jest.fn();
	const mockSetGridViewOptions = jest.fn();

	const mockStore = {
		view: "list",
		setView: mockSetView,
		displayOptions: {
			taskOrder: { orderBy: "Priority", orderAscending: true },
			groupTasksBy: "Status",
			showCompletedTasks: { show: true, period: "Past day" },
			showSubTasks: true,
			viewOptions: {
				listOptions: {
					showEmptyGroups: true,
					displayProperties: {
						status: true,
						priority: true,
						dueDate: true,
					},
				},
			},
		},
		setListViewOptions: mockSetListViewOptions,
		setGridViewOptions: mockSetGridViewOptions,
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(useViewStore as jest.Mock).mockReturnValue(mockStore);
	});

	// Existing tests remain unchanged

	it("updates grouping option", () => {
		render(<TopNavBarDisplay />);
		fireEvent.click(screen.getByText("Display"));

		const groupingButton = screen.getByRole("button", { name: /status/i });
		fireEvent.click(groupingButton);

		const priorityOption = screen.getByRole("menuitem", { name: /priority/i });
		fireEvent.click(priorityOption);

		expect(mockSetListViewOptions).toHaveBeenCalledWith(
			expect.objectContaining({
				groupTasksBy: "Priority",
			}),
		);
	});

	it("toggles order ascending/descending", () => {
		render(<TopNavBarDisplay />);
		fireEvent.click(screen.getByText("Display"));

		const orderButton = screen.getByRole("button", { name: /priority/i });
		fireEvent.click(orderButton);

		const ascDescButton = screen.getByRole("button", { name: /arrow/i });
		fireEvent.click(ascDescButton);

		expect(mockSetListViewOptions).toHaveBeenCalledWith(
			expect.objectContaining({
				taskOrder: { orderBy: "Priority", orderAscending: false },
			}),
		);
	});

	it("updates completed tasks period", () => {
		render(<TopNavBarDisplay />);
		fireEvent.click(screen.getByText("Display"));

		const completedTasksButton = screen.getByRole("button", {
			name: /past day/i,
		});
		fireEvent.click(completedTasksButton);

		const pastWeekOption = screen.getByRole("menuitem", { name: /past week/i });
		fireEvent.click(pastWeekOption);

		expect(mockSetListViewOptions).toHaveBeenCalledWith(
			expect.objectContaining({
				showCompletedTasks: { show: true, period: "Past week" },
			}),
		);
	});

	it("toggles show subtasks", () => {
		render(<TopNavBarDisplay />);
		fireEvent.click(screen.getByText("Display"));

		const subtasksSwitch = screen.getByRole("switch", {
			name: /show subtasks/i,
		});
		fireEvent.click(subtasksSwitch);

		expect(mockSetListViewOptions).toHaveBeenCalledWith(
			expect.objectContaining({
				showSubTasks: false,
			}),
		);
	});

	it("toggles display properties", () => {
		render(<TopNavBarDisplay />);
		fireEvent.click(screen.getByText("Display"));

		const displayPropertiesSection = screen
			.getByText("Display Properties")
			.closest("div");

		if (!displayPropertiesSection) {
			throw new Error("Display Properties section not found");
		}
		const statusButton = within(displayPropertiesSection).getByRole("button", {
			name: /status/i,
		});
		fireEvent.click(statusButton);

		expect(mockSetListViewOptions).toHaveBeenCalledWith(
			expect.objectContaining({
				viewOptions: {
					listOptions: {
						displayProperties: expect.objectContaining({
							status: false,
						}),
					},
				},
			}),
		);
	});
});
