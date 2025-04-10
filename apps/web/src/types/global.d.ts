import type {
	Autocomplete,
	OrganizationSystemPermissionKey,
} from "@clerk/types";
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

	interface ClerkAuthorization {
		role: "org:admin" | "org:member" | "org:owner";
		permissions: Autocomplete<
			OrganizationSystemPermissionKey | string[] | undefined
		>;
	}
}

declare module "@tanstack/react-table" {
	interface ColumnMeta<_TData extends RowData, _TValue> {
		page: string;
		pageId: string | undefined;
		setPageUsers?: (users: MemberWithRole[]) => void;
		membersWithRoles?: MemberWithRole[];
	}
}
