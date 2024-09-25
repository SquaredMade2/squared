import type { User, Workspace } from "@repo/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "..";

export const comparePassword = (
	password: string,
	hashed: string,
): Promise<boolean> => {
	return bcrypt.compare(password, hashed);
};

export const hashPassword = (password: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(10, (error, salt) => {
			if (error) {
				reject(error);
			}
			bcrypt.hash(password, salt, (error, hash) => {
				if (error) {
					reject(error);
				}
				resolve(hash);
			});
		});
	});
};

export const returnToken = async (user: User, JWT_SECRET: string) => {
	const userWorkspaces: Workspace[] = await prisma.userWorkspace
		.findMany({
			where: { userId: user.id },
			include: { workspace: true },
		})
		.then((workspaces) => workspaces.map((uw) => uw.workspace));

	const token = jwt.sign(
		{
			email: user.email,
			id: user.id,
			name: user.name,
			defaultWorkspace: user.defaultWorkspaceId,
			lastLogin: user.lastLogin,
			workspaces: userWorkspaces,
		},
		JWT_SECRET,
	);
	return { token };
};
