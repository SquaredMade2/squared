// biome-ignore lint/correctness/noUnusedImports: We are definitely using it
import type { jest } from "@jest/globals";
import "@tanstack/react-table";

declare global {
	// biome-ignore lint/suspicious/noRedeclare: We are extending the global namespace
	namespace jest {
		interface Matchers<R> {
			// biome-ignore lint/suspicious/noExplicitAny: Expected could be anything
			toEqualWithDatePrecision(expected: any, precision?: number): R;
		}
	}

	interface Window {
		sessionStorage: {
			getItem: jest.MockedFunction<(key: string) => string | null>;
			setItem: jest.MockedFunction<(key: string, value: string) => void>;
			removeItem: jest.MockedFunction<(key: string) => void>;
			clear: jest.MockedFunction<() => void>;
		};
	}
}

declare module "@tanstack/react-table" {
	// biome-ignore lint/correctness/noUnusedVariables: According to Tanstack Table docs, this is the proper way to extend typing for ColumnMeta.
	interface ColumnMeta<TData extends RowData, TValue> {
		setWorkspaceUsers?: (users: MemberWithRole[]) => void;
		membersWithRoles?: MemberWithRole[];
	}
}
