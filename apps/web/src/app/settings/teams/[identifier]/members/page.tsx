"use client";

import { userService } from "@/lib/services";
import { useTeamStore } from "@/store";
import { TODO } from "@squared/context";
import type { User } from "@squared/db";
import { useEffect, useState } from "react";

export default function TeamMembersPage() {
	const { team } = useTeamStore((state) => state);
	const [teamUsers, setTeamUsers] = useState<User[]>([]);

	useEffect(() => {
		const fetchTeamUsers = async () => {
			if (!team) return;
			const users = await userService.getTeamUsers(TODO, { teamId: team.id });
			setTeamUsers(users);
		};
		fetchTeamUsers();
	}, [team]);

	return <div>TeamMembersPage</div>;
}
