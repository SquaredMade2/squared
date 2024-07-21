import bcrypt from "bcryptjs";

const hashPassword = (password: string): Promise<string> => {
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

const comparePassword = (password: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(password, hashed);
};

export {
  hashPassword,
  comparePassword,
};
