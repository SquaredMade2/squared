// type-debug-test.ts
// Run this file to debug each step of the type inference

import type { ClientRequest } from "hono/client";
import type { TypedResponse } from "hono/types";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { InvalidJSONValue } from "hono/utils/types";
import type { JSONValue } from "hono/utils/types";
import type { JSONParsed } from "hono/utils/types";
import type { SimplifyDeepArray } from "hono/utils/types";
import type { Client } from "./client";
import { sqStack } from "./j";
import type { InferSchemaFromRouters } from "./merge-routers";
import type { OperationSchema, Router } from "./router"; // Adjust import path
import type { GetOperation } from "./types"; // Adjust import paths

export type JSONRespondReturn<
	T extends JSONValue | SimplifyDeepArray<unknown> | InvalidJSONValue,
	U extends ContentfulStatusCode,
> = Response &
	TypedResponse<
		SimplifyDeepArray<T> extends JSONValue
			? JSONValue extends SimplifyDeepArray<T>
				? never
				: JSONParsed<T>
			: never,
		U,
		"json"
	>;

// Mock types for testing
interface AppEnv {
	Bindings: { DATABASE_URL: string };
}

const j = sqStack.init<AppEnv>();
const api = j
	.router()
	.basePath("/api")
	.use(j.defaults.cors)
	.onError(j.defaults.errorHandler);

const authRouter = j.router({
	test: j.procedure.get(({ c }) => c.json({ message: "test" })),
});

const appRouter = j.mergeRouters(api, {
	auth: authRouter,
});

type TestAppRouter = typeof appRouter;

// =============================================================================
// STEP 1: Test InferSchemaFromRouters
// =============================================================================

type Step1_Input = {
	auth: Router<
		{
			test: GetOperation<
				void,
				JSONRespondReturn<
					{
						message: string;
					},
					ContentfulStatusCode
				>,
				AppEnv
			>;
		},
		AppEnv
	>;
};

type Step1_Actual = InferSchemaFromRouters<Step1_Input, AppEnv>;

type Step1_Expected = {
	auth: {
		test: GetOperation<
			void,
			JSONRespondReturn<
				{
					message: string;
				},
				ContentfulStatusCode
			>,
			AppEnv
		>;
	};
};

// Test: Should be true if InferSchemaFromRouters works correctly
type Step1_Test = Step1_Actual extends Step1_Expected ? true : false;
type Step1_Reverse = Step1_Expected extends Step1_Actual ? true : false;
type Step1_Equal = Step1_Test extends true
	? Step1_Reverse extends true
		? "PASS"
		: "FAIL - Expected extends Actual but not vice versa"
	: "FAIL - Actual does not extend Expected";

// =============================================================================
// STEP 2: Test OperationSchema on GetOperation
// =============================================================================

type Step2_Input = GetOperation<
	void,
	JSONRespondReturn<
		{
			message: string;
		},
		ContentfulStatusCode
	>,
	AppEnv
>;

type Step2_Actual = OperationSchema<Step2_Input>;

type Step2_Expected = {
	$get: {
		input: void;
		output: {
			message: string;
		};
		outputFormat: "json";
		status: ContentfulStatusCode;
	};
};

type Step2_Test = Step2_Actual extends Step2_Expected ? true : false;
type Step2_Reverse = Step2_Expected extends Step2_Actual ? true : false;
type Step2_Equal = Step2_Test extends true
	? Step2_Reverse extends true
		? "PASS"
		: "FAIL - Expected extends Actual but not vice versa"
	: "FAIL - Actual does not extend Expected";

// =============================================================================
// STEP 3: Test Router Schema Extraction
// =============================================================================

type Step3_Input = TestAppRouter;

type Step3_Actual = Step3_Input extends Router<infer S, any> ? S : never;

type Step3_Expected = {
	auth: {
		test: {
			$get: {
				input: void;
				output: {
					message: string;
				};
				outputFormat: "json";
				status: ContentfulStatusCode;
			};
		};
	};
};

type Step3_Test = Step3_Actual extends Step3_Expected ? true : false;
type Step3_Reverse = Step3_Expected extends Step3_Actual ? true : false;
type Step3_Equal = Step3_Test extends true
	? Step3_Reverse extends true
		? "PASS"
		: "FAIL - Expected extends Actual but not vice versa"
	: "FAIL - Actual does not extend Expected";

// =============================================================================
// STEP 4: Test Client Type
// =============================================================================

type Step4_Input = TestAppRouter;

type Step4_Actual = Client<Step4_Input>;

type Step4_Expected = {
	auth: {
		test: ClientRequest<{
			$get: {
				input: void;
				output: {
					message: string;
				};
				outputFormat: "json";
				status: ContentfulStatusCode;
			};
		}>;
	};
};

type Step4_Test = Step4_Actual extends Step4_Expected ? true : false;
type Step4_Reverse = Step4_Expected extends Step4_Actual ? true : false;
type Step4_Equal = Step4_Test extends true
	? Step4_Reverse extends true
		? "PASS"
		: "FAIL - Expected extends Actual but not vice versa"
	: "FAIL - Actual does not extend Expected";
