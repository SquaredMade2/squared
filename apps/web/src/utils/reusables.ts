export const checkRouteIncludes = (
  pathname: string,
  ...args: string[]
): boolean => {
  return args.some((arg) => pathname.includes(arg));
};
