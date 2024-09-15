import type { Request, Response, NextFunction } from "express";
import type { ParsedQs } from "qs";

export type APIResponse<Type> = {
	data: Type | Type[] | null;
	message?: string;
	variant: "default" | "destructive";
};

export type Route<P = Record<string, string>> = {
	GET?: (
		res: Response,
		params: P,
		query: ParsedQs,
		// biome-ignore lint/complexity/noBannedTypes: <explanation>
	) => Promise<APIResponse<Object>>;
	POST?: (
		res: Response,
		params: P,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		body: any,
		query: ParsedQs,
		// biome-ignore lint/complexity/noBannedTypes: <explanation>
	) => Promise<APIResponse<Object>>;
	PUT?: (
		res: Response,
		params: P,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		body: any,
		query: ParsedQs,
		// biome-ignore lint/complexity/noBannedTypes: <explanation>
	) => Promise<APIResponse<Object>>;
	DELETE?: (
		res: Response,
		params: P,
		query: ParsedQs,
		// biome-ignore lint/complexity/noBannedTypes: <explanation>
	) => Promise<APIResponse<Object>>;
};

function handleNotSupported(_: unknown, res: Response) {
	res.status(405).send();
}

export function toQueryHandler<P = Record<string, string>>(
	f?: (res: Response, params: P, query: ParsedQs) => Promise<unknown>,
) {
	if (!f) return handleNotSupported;

	return (req: Request<P>, res: Response, next: NextFunction) => {
		f(res, req.params, req.query).then((data) => res.json(data), next);
	};
}

export function toMutationHandler<P = Record<string, string>>(
	f?: (
		res: Response,
		params: P,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		body: any,
		query: ParsedQs,
	) => Promise<unknown>,
) {
	if (!f) return handleNotSupported;

	return (req: Request<P>, res: Response, next: NextFunction) => {
		f(res, req.params, req.body, req.query).then(
			(data) => res.json(data),
			next,
		);
	};
}
