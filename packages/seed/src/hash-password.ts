import bcrypt from "bcryptjs";
import "dotenv/config";

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
