import type { AppRouter } from "@/services";
import { createClient } from "@squaredmade/rpc";

export const client = createClient<AppRouter>({
	baseUrl: `${process.env.SERVER_URL}/api`,
});
