import { redirectToPreviewURL, setPreviewData } from "@prismicio/next";
import type { NextApiRequest, NextApiResponse } from "next";

import { createClient } from "@/prismic/prismicio";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const client = createClient({ req });

	await setPreviewData({ req, res });

	return await redirectToPreviewURL({ req, res, client });
}
