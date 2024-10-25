import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TopNavBarDisplay from ".";
import { useViewStore } from "@/store";

jest.mock("@/store", () => ({
	useViewStore: jest.fn(),
}));

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

	it("renders without crashing and displays the initial button", () => {
		render(<TopNavBarDisplay />);
		const displayButton = screen.getByRole("button", { name: /display/i });
		expect(displayButton).toBeInTheDocument();
	});

	it("opens the popover when clicking the display button", () => {
		render(<TopNavBarDisplay />);
		const displayButton = screen.getByRole("button", { name: /display/i });

		// Click the display button
		fireEvent.click(displayButton);

		// Check if the popover content is now visible
		const groupingText = screen.getByText("Grouping");
		const orderingText = screen.getByText("Ordering");
		const completedTasksText = screen.getByText("Completed tasks");

		expect(groupingText).toBeInTheDocument();
		expect(orderingText).toBeInTheDocument();
		expect(completedTasksText).toBeInTheDocument();
	});

	it("changes view when toggling between list and grid", () => {
		render(<TopNavBarDisplay />);
		const displayButton = screen.getByRole("button", { name: /display/i });
		fireEvent.click(displayButton);

		// Initially, the view should be 'list'
		expect(mockStore.view).toBe("list");

		// Find and click the 'Grid' button
		const gridButton = screen.getByRole("radio", { name: /grid/i });
		fireEvent.click(gridButton);

		// Check if setView was called with 'grid'
		expect(mockSetView).toHaveBeenCalledWith("grid");

		// Update the mock store to reflect the change
		mockStore.view = "grid";

		// Find and click the 'List' button
		const listButton = screen.getByRole("radio", { name: /list/i });
		fireEvent.click(listButton);

		// Check if setView was called with 'list'
		expect(mockSetView).toHaveBeenCalledWith("list");
	});
});
