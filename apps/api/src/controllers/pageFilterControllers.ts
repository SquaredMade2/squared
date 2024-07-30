import { Request, Response, NextFunction } from "express";
import Task from "../models/task";
import AppError from "../utils/AppError";
import PageFilter from "../models/pageFilter";
import { format } from "path";
import { mongo } from "mongoose";

export interface DateFilter {
	date: string;
	comparison?: "before" | "after";
}

export const addFilter = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void | Response> => {
	const createdFilter = await PageFilter.create(req.body);
	if (!createdFilter) {
		return next(new AppError("$$$ Filter Not Created $$$", 500));
	} else {
		res.send(createdFilter);
	}
};

export const getSelectedFilters = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void | Response> => {
	const teamId = req.params.teamId;
	const filters = await PageFilter.find({ teamId: teamId });
	if (!filters) {
		return next(new AppError("$$$ Filters Not Found $$$", 500));
	} else {
		res.json(filters);
	}
};

export const getFilteredTasks = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void | Response> => {
	if (req.method === "POST") {
		const teamId = req.params.teamId;
		const { filters: currentFilters, filterType } = req.body;

		// Remove empty filters to avoid unnecessary database queries
		Object.keys(currentFilters).forEach((key) => {
			if (currentFilters[key].length === 0) {
				delete currentFilters[key];
			}
		});

		// Format filters for MongoDB querying
		let queryFilters = [];
		for (let [key, value] of Object.entries(currentFilters)) {
			if (key === "assignee") {
				queryFilters.push({
					"assignee.name": value !== "unassigned" ? { $eq: value } : null,
				});
			} else if (key === "dueDate") {
				(value as DateFilter[]).forEach((dateFilter) => {
					if (dateFilter.comparison === "before") {
						queryFilters.push({ dueDate: { $lt: new Date(dateFilter.date) } });
					} else if (dateFilter.comparison === "after") {
						queryFilters.push({ dueDate: { $gt: new Date(dateFilter.date) } });
					} else {
						queryFilters.push({ dueDate: new Date(dateFilter.date) });
					}
				});
			} else if (key === "labels" && filterType === "all") {
				queryFilters.push({ [key]: { $all: value } }); // when type is 'all', use $all to match ALL labels selected
			} else {
				queryFilters.push({ [key]: { $in: value } }); // when type is 'any', use $in to match ANY label selected
			}
		}

		const mongoOperator = filterType === "all" ? "$and" : "$or";
		const query = { [mongoOperator]: queryFilters, team: teamId };

		try {
			const filteredTasks = await Task.find(query);
			res.json(filteredTasks);
		} catch (error) {
			res.status(500).send("Internal Server Error");
		}
	}

	// get filtered tasks when selecting a saved filter -- keep comment for clarity
	if (req.method === "GET") {
		const teamId = req.params.teamId;
		const filterId = req.params.filterId;
		const filters = await PageFilter.findById(filterId);

		if (!filters) {
			return next(new AppError("$$$ Filters Not Found $$$", 500));
		}

		const filterKeys = Object.keys(filters.filterOption);

		filterKeys.forEach((filter) => {
			if (filters.filterOption[filter].length === 0) {
				delete filters.filterOption[filter];
			}
		});

		const formattedFilter = Object.entries(filters.filterOption)
			.map((filter) => {
				const [key, value] = filter;

				if (key === "dueDate") {
					return (value as DateFilter[]).map((dateFilter) => {
						if (dateFilter.comparison === "before") {
							return { dueDate: { $lt: new Date(dateFilter.date) } };
						} else if (dateFilter.comparison === "after") {
							return { dueDate: { $gt: new Date(dateFilter.date) } };
						} else {
							return { dueDate: new Date(dateFilter.date) };
						}
					});
				} else {
					return { [key]: { $in: value } };
				}
			})
			.flat();

		const mongoDBFilter: any = { $or: [], team: teamId };

		for (let i = 0; i <= formattedFilter.length - 1; i++) {
			mongoDBFilter.$or.push(formattedFilter[i]);
		}
		const filteredTasks = await Task.find(mongoDBFilter);

		res.json(filteredTasks);
	}
};

export const deleteView = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void | Response> => {
	const viewDelete = await PageFilter.deleteOne({ _id: req.body.filterId });

	const newViewList = await PageFilter.find({ teamId: req.body.teamId });
	if (!newViewList) {
		return next(new AppError("$$$ Filters Not Found $$$", 500));
	} else {
		res.json(newViewList);
	}
};

module.exports = {
	addFilter,
	getSelectedFilters,
	getFilteredTasks,
	deleteView,
};
