import type {
	Autocomplete,
	OrganizationSystemPermissionKey,
} from "@clerk/types";
import type { jest } from "@jest/globals";
import "@tanstack/react-table";

declare global {
	interface Window {
		sessionStorage: {
			getItem: jest.MockedFunction<(key: string) => string | null>;
			setItem: jest.MockedFunction<(key: string, value: string) => void>;
			removeItem: jest.MockedFunction<(key: string) => void>;
			clear: jest.MockedFunction<() => void>;
		};
	}
	interface ClerkAuthorization {
		role: "org:admin" | "org:member";
		permissions: Autocomplete<OrganizationSystemPermissionKey | string[]>;
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
