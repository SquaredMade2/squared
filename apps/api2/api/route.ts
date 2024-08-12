import { Router, Request, Response, NextFunction } from "express";
import { ParsedQs } from "qs";

export type Route<P = Record<string, string>> = {
  GET?: (params: P, query: ParsedQs) => Promise<any>;
  POST?: (params: P, body: any, query: ParsedQs) => Promise<any>;
  PUT?: (params: P, body: any, query: ParsedQs) => Promise<any>;
  DELETE?: (params: P, query: ParsedQs) => Promise<any>;
};

function handleNotSupported(_: unknown, res: Response) {
  res.status(405).send();
}

export function toQueryHandler<P = Record<string, string>>(
  f?: (params: P, query: ParsedQs) => Promise<unknown>
) {
  if (!f) return handleNotSupported;

  return (req: Request<P>, res: Response, next: NextFunction) => {
    f(req.params, req.query).then((data) => res.json(data), next);
  };
}

export function toMutationHandler<P = Record<string, string>>(
  f?: (params: P, body: any, query: ParsedQs) => Promise<unknown>
) {
  if (!f) return handleNotSupported;

  return (req: Request<P>, res: Response, next: NextFunction) => {
    f(req.params, req.body, req.query).then(
      (data) => res.json(data),
      next
    );
  };
}
