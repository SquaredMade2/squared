import Profile from "@/components/Profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Profile",
	description: "Manage your user profile and preferences.",
};

const ProfilePage = () => {
	return <Profile />;
};

export default ProfilePage;
