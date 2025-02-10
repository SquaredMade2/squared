import type { JSONValue } from "./types";
import { find } from "./util";

export interface CustomTransfomer<I, O extends JSONValue> {
	name: string;
	// biome-ignore lint/suspicious/noExplicitAny: any is needed here because of the type of transfomers
	isApplicable: (v: any) => v is I;
	serialize: (v: I) => O;
	deserialize: (v: O) => I;
}

export class CustomTransformerRegistry {
	// biome-ignore lint/suspicious/noExplicitAny: any is needed here because of the type of transfomers
	private transfomers: Record<string, CustomTransfomer<any, any>> = {};

	register<I, O extends JSONValue>(transformer: CustomTransfomer<I, O>) {
		this.transfomers[transformer.name] = transformer;
	}

	findApplicable<T>(v: T) {
		return find(this.transfomers, (transformer) =>
			transformer.isApplicable(v),
		) as CustomTransfomer<T, JSONValue> | undefined;
	}

	findByName(name: string) {
		return this.transfomers[name];
	}
}
