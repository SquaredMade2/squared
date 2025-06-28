import { DoubleIndexedKV } from "./double-indexed-kv.js";

export class Registry<T> {
	private kv = new DoubleIndexedKV<string, T>();
	private readonly generateIdentifier: (v: T) => string;

	constructor(generateIdentifier: (v: T) => string) {
		this.generateIdentifier = generateIdentifier;
	}

	register(value: T, identifier?: string): void {
		let newIdentifier = identifier;
		if (this.kv.getByValue(value)) {
			return;
		}

		if (!newIdentifier) {
			newIdentifier = this.generateIdentifier(value);
		}

		this.kv.set(newIdentifier, value);
	}

	clear(): void {
		this.kv.clear();
	}

	getIdentifier(value: T) {
		return this.kv.getByValue(value);
	}

	getValue(identifier: string) {
		return this.kv.getByKey(identifier);
	}
}
