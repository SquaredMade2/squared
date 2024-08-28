import type { Request, Response, NextFunction } from "express";
import type { ParsedQs } from "qs";

export type Route<P = Record<string, string>> = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	GET?: (params: P, query: ParsedQs) => Promise<any>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	POST?: (params: P, body: any, res:Response, query: ParsedQs) => Promise<any>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	PUT?: (params: P, body: any, query: ParsedQs) => Promise<any>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	DELETE?: (params: P, query: ParsedQs) => Promise<any>;
};

function handleNotSupported(_: unknown, res: Response) {
	res.status(405).send();
}

export function toQueryHandler<P = Record<string, string>>(
	f?: (params: P, query: ParsedQs) => Promise<unknown>,
) {
	if (!f) return handleNotSupported;

	return (req: Request<P>, res: Response, next: NextFunction) => {
		f(req.params, req.query).then((data) => res.json(data), next);
	};
}

export function toMutationHandler<P = Record<string, string>>(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	f?: (params: P, body: any, res: Response, query: ParsedQs) => Promise<unknown>,
) {
	if (!f) return handleNotSupported;

	return (req: Request<P>, res: Response, next: NextFunction) => {
		f(req.params, req.body, res, req.query).then((data) => res.json(data), next);
	};
}
