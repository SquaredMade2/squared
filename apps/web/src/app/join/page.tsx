import Join from "@/components/Join";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Join",
	description:
		"Join Squared today and start organizing, managing, and collaborating on your tasks.",
};

const JoinPage = () => {
	return <Join />;
};

export default JoinPage;
