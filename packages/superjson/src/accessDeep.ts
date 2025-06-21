/** biome-ignore-all lint/suspicious/noExplicitAny: There's no way of knowing the types, but this isn't exposed */
import { isArray, isMap, isPlainObject, isSet } from "./is.js";
import { includes } from "./util.js";

const getNthKey = (value: Map<any, any> | Set<any>, n: number): any => {
	if (n > value.size) throw new Error("index out of bounds");
	const keys = value.keys();
	for (let i = 0; i < n; i++) {
		keys.next();
	}

	return keys.next().value;
};

function validatePath(path: (string | number)[]) {
	if (includes(path, "__proto__")) {
		throw new Error("__proto__ is not allowed as a property");
	}
	if (includes(path, "prototype")) {
		throw new Error("prototype is not allowed as a property");
	}
	if (includes(path, "constructor")) {
		throw new Error("constructor is not allowed as a property");
	}
}

export const getDeep = (object: object, path: (string | number)[]): object => {
	validatePath(path);
	let newObject = object;

	for (const [i, key] of path.entries()) {
		if (isSet(newObject)) {
			newObject = getNthKey(newObject, +key);
		} else if (isMap(newObject)) {
			const row = +key;
			const type = +path[i + 1] === 0 ? "key" : "value";

			const keyOfRow = getNthKey(newObject, row);
			switch (type) {
				case "key":
					newObject = keyOfRow;
					break;
				case "value":
					newObject = newObject.get(keyOfRow);
					break;
			}

			// Skip the next iteration since we consumed path[i + 1]
			path.splice(i + 1, 1);
		} else {
			newObject = (newObject as any)[key];
		}
	}

	return newObject;
};

export const setDeep = (
	object: any,
	path: (string | number)[],
	mapper: (v: any) => any,
): any => {
	validatePath(path);

	if (path.length === 0) {
		return mapper(object);
	}

	let parent = object;

	for (let i = 0; i < path.length - 1; i++) {
		const key = path[i];

		if (isArray(parent)) {
			const index = +key;
			parent = parent[index];
		} else if (isPlainObject(parent)) {
			parent = parent[key];
		} else if (isSet(parent)) {
			const row = +key;
			parent = getNthKey(parent, row);
		} else if (isMap(parent)) {
			const isEnd = i === path.length - 2;
			if (isEnd) {
				break;
			}

			const row = +key;
			const type = +path[++i] === 0 ? "key" : "value";

			const keyOfRow = getNthKey(parent, row);
			switch (type) {
				case "key":
					parent = keyOfRow;
					break;
				case "value":
					parent = parent.get(keyOfRow);
					break;
			}
		}
	}

	const lastKey = path.at(-1);
	if (!lastKey) {
		throw new Error("Invalid path");
	}

	if (isArray(parent)) {
		parent[+lastKey] = mapper(parent[+lastKey]);
	} else if (isPlainObject(parent)) {
		parent[lastKey] = mapper(parent[lastKey]);
	}

	if (isSet(parent)) {
		const oldValue = getNthKey(parent, +lastKey);
		const newValue = mapper(oldValue);
		if (oldValue !== newValue) {
			parent.delete(oldValue);
			parent.add(newValue);
		}
	}

	const lastKeyIndex = path.at(-2);

	if (isMap(parent) && lastKeyIndex) {
		const row = +lastKeyIndex;
		const keyToRow = getNthKey(parent, row);

		const type = +lastKey === 0 ? "key" : "value";
		switch (type) {
			case "key": {
				const newKey = mapper(keyToRow);
				parent.set(newKey, parent.get(keyToRow));

				if (newKey !== keyToRow) {
					parent.delete(keyToRow);
				}
				break;
			}

			case "value": {
				parent.set(keyToRow, mapper(parent.get(keyToRow)));
				break;
			}
		}
	}

	return object;
};
