import * as React from "react";

type Machine<S> = { [k: string]: { [k: string]: S } };
type MachineState<T> = keyof T;
type MachineEvent<T> = keyof UnionToIntersection<T[keyof T]>;

// 🤯 https://fettblog.eu/typescript-union-to-intersection/
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ✨ This is template magic ✨
type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (
	x: infer R,
) => any
	? R
	: never;

export function useStateMachine<M>(
	initialState: MachineState<M>,
	machine: M & Machine<MachineState<M>>,
) {
	return React.useReducer(
		(state: MachineState<M>, event: MachineEvent<M>): MachineState<M> => {
			// Very much like the reducer in useReducer, but with a more specific type signature.
			const nextState =
				machine[state][event as keyof (M & Machine<keyof M>)[keyof M]];
			return nextState ?? state;
		},
		initialState,
	);
}
