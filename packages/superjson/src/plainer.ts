/** biome-ignore-all lint/suspicious/noExplicitAny: This isn't externally exposed */
import { getDeep, setDeep } from "./accessDeep.js";
import type SuperJSON from "./index.js";
import {
	isArray,
	isEmptyObject,
	isMap,
	isPlainObject,
	isPrimitive,
	isSet,
} from "./is.js";
import { escapeKey, parsePath, stringifyPath } from "./pathstringifier.js";
import {
	isInstanceOfRegisteredClass,
	type TypeAnnotation,
	transformValue,
	untransformValue,
} from "./transformer.js";
import { forEach, includes } from "./util.js";

type Tree<T> = InnerNode<T> | Leaf<T>;
type Leaf<T> = [T];
type InnerNode<T> = [T, Record<string, Tree<T>>];

export type MinimisedTree<T> = Tree<T> | Record<string, Tree<T>> | undefined;

function traverse<T>(
	tree: MinimisedTree<T>,
	w: (v: T, path: string[]) => void,
	origin: string[] = [],
): void {
	if (!tree) {
		return;
	}

	if (!isArray(tree)) {
		forEach(tree, (subtree, key) =>
			traverse(subtree, w, [...origin, ...parsePath(key)]),
		);
		return;
	}

	const [nodeValue, children] = tree;
	if (children) {
		forEach(children, (child, key) => {
			traverse(child, w, [...origin, ...parsePath(key)]);
		});
	}

	w(nodeValue, origin);
}

export function applyValueAnnotations(
	plain: any,
	annotations: MinimisedTree<TypeAnnotation>,
	superJson: SuperJSON,
) {
	let newPlain = plain;
	traverse(annotations, (type, path) => {
		newPlain = setDeep(newPlain, path, (v) =>
			untransformValue(v, type, superJson),
		);
	});

	return newPlain;
}

export function applyReferentialEqualityAnnotations(
	plain: any,
	annotations: ReferentialEqualityAnnotations,
) {
	let newPlain = plain;
	function apply(identicalPaths: string[], path: string) {
		const object = getDeep(newPlain, parsePath(path));

		for (const identicalObjectPath of identicalPaths.map(parsePath)) {
			newPlain = setDeep(newPlain, identicalObjectPath, () => object);
		}
	}

	if (isArray(annotations)) {
		const [root, other] = annotations;
		for (const identicalPath of root) {
			newPlain = setDeep(newPlain, parsePath(identicalPath), () => newPlain);
		}

		if (other) {
			forEach(other, apply);
		}
	} else {
		forEach(annotations, apply);
	}

	return newPlain;
}

const isDeep = (object: any, superJson: SuperJSON): boolean =>
	isPlainObject(object) ||
	isArray(object) ||
	isMap(object) ||
	isSet(object) ||
	isInstanceOfRegisteredClass(object, superJson);

function addIdentity(object: any, path: any[], identities: Map<any, any[][]>) {
	const existingSet = identities.get(object);

	if (existingSet) {
		existingSet.push(path);
	} else {
		identities.set(object, [path]);
	}
}

interface Result {
	transformedValue: any;
	annotations?: MinimisedTree<TypeAnnotation>;
}

export type ReferentialEqualityAnnotations =
	| Record<string, string[]>
	| [string[]]
	| [string[], Record<string, string[]>];

export function generateReferentialEqualityAnnotations(
	identities: Map<any, any[][]>,
	dedupe: boolean,
): ReferentialEqualityAnnotations | undefined {
	const result: Record<string, string[]> = {};
	let rootEqualityPaths: string[] | undefined;

	for (let [_, paths] of identities.entries()) {
		if (paths.length <= 1) {
			continue;
		}

		// if we're not deduping, all of these objects continue existing.
		// putting the shortest path first makes it easier to parse for humans
		// if we're deduping though, only the first entry will still exist, so we can't do this optimisation.
		if (!dedupe) {
			paths = paths
				.map((path) => path.map(String))
				.sort((a, b) => a.length - b.length);
		}

		const [representativePath, ...identicalPaths] = paths;

		if (representativePath.length === 0) {
			rootEqualityPaths = identicalPaths.map(stringifyPath);
		} else {
			result[stringifyPath(representativePath)] =
				identicalPaths.map(stringifyPath);
		}
	}

	if (rootEqualityPaths) {
		if (isEmptyObject(result)) {
			return [rootEqualityPaths];
		}
		return [rootEqualityPaths, result];
	}
	return isEmptyObject(result) ? undefined : result;
}

export const walker = (
	object: any,
	identities: Map<any, any[][]>,
	superJson: SuperJSON,
	dedupe: boolean,
	path: any[] = [],
	objectsInThisPath: any[] = [],
	seenObjects = new Map<unknown, Result>(),
): Result => {
	const primitive = isPrimitive(object);

	if (!primitive) {
		addIdentity(object, path, identities);

		const seen = seenObjects.get(object);
		if (seen) {
			// short-circuit result if we've seen this object before
			return dedupe
				? {
						transformedValue: null,
					}
				: seen;
		}
	}

	if (!isDeep(object, superJson)) {
		const transformed = transformValue(object, superJson);

		const result: Result = transformed
			? {
					annotations: [transformed.type],
					transformedValue: transformed.value,
				}
			: {
					transformedValue: object,
				};
		if (!primitive) {
			seenObjects.set(object, result);
		}
		return result;
	}

	if (includes(objectsInThisPath, object)) {
		// prevent circular references
		return {
			transformedValue: null,
		};
	}

	const transformationResult = transformValue(object, superJson);
	const transformed = transformationResult?.value ?? object;

	const transformedValue: any = isArray(transformed) ? [] : {};
	const innerAnnotations: Record<string, Tree<TypeAnnotation>> = {};

	for (const [index, value] of Object.entries(transformed)) {
		if (
			index === "__proto__" ||
			index === "constructor" ||
			index === "prototype"
		) {
			throw new Error(
				`Detected property ${index}. This is a prototype pollution risk, please remove it from your object.`,
			);
		}

		const recursiveResult = walker(
			value,
			identities,
			superJson,
			dedupe,
			[...path, index],
			[...objectsInThisPath, object],
			seenObjects,
		);

		transformedValue[index] = recursiveResult.transformedValue;

		if (isArray(recursiveResult.annotations)) {
			innerAnnotations[index] = recursiveResult.annotations;
		} else if (isPlainObject(recursiveResult.annotations)) {
			for (const [key, tree] of Object.entries(recursiveResult.annotations)) {
				innerAnnotations[`${escapeKey(index)}.${key}`] = tree;
			}
		}
	}

	const result: Result = isEmptyObject(innerAnnotations)
		? {
				annotations: transformationResult
					? [transformationResult.type]
					: undefined,
				transformedValue,
			}
		: {
				annotations: transformationResult
					? [transformationResult.type, innerAnnotations]
					: innerAnnotations,
				transformedValue,
			};
	if (!primitive) {
		seenObjects.set(object, result);
	}

	return result;
};
