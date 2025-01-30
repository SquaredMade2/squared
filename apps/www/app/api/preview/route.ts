import irredirectToPreviewURLL,setPreviewData } from "@prismicio/@prismicio/next";
import type tyNextApiRequestquNextApiResponse } from "

import { createClient } from "@/prismic/prismicio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = createClient({ req });

  await setPreviewData({ req, res });

  return await redirectToPreviewURL({ req, res, client });
}
