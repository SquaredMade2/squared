import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export function POST() {
	revalidateTag("prismic");

	return NextResponse.json({ now: Date.now(), revalidated: true });
}
