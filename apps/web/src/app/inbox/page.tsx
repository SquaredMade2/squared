import Inbox from "@/components/Inbox";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Inbox",
	description:
		"View all your messages and notifications in one place with the Squared inbox.",
};

const InboxPage = () => {
	return <Inbox />;
};

export default InboxPage;
