import { User } from "@repo/db/src";
import { prisma } from "@/api";
import jwt from "jsonwebtoken";
import { Route } from "@/api/route";
import { comparePassword, hashPassword, sendMail } from "./helpers"

type Login = {
	provider: "credentials" | "oauth";
	type: "register" | "login";
	email: string;
	password?: string;
  name?: string;
  username?: string;
};

type Params = {
  userId: string;
};

type body = {
    login: Login
}

const JWT_SECRET = process.env.JWT_SECRET;

export function createRoute({}): Route<Params> {
  return {
    POST: async ({ userId }, body: body) => {
      try {
        const { email, password, provider, type, name, username } = body.login;

        if (!email || (provider === "credentials" && !password)) {
          throw new Error("Email and password are required.");
        }
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined.");
          }
        if (type === "register") {
          // Registration logic
          if (!name) {
            throw new Error("Name is required.");
          }

          if (password!.length < 6) {
            throw new Error(
              "Password is required and should be at least 6 characters long."
            );
          }

          const existingUser = await prisma.user.findUnique({ where: { email } });

          if (existingUser) {
            throw new Error("This email is already registered.");
          }

          const hashedPassword = await hashPassword(password!);

          const user = await prisma.user.create({
            data: {
              name,
              username,
              email,
              password: hashedPassword,
              verified: false,
            },
          });

          jwt.sign(
            { user: user.id },
            JWT_SECRET,
            { expiresIn: "1d" },
            (err, emailToken) => {
              if (err) throw err;
              sendMail(email, username!, emailToken, "confirmation");
            }
          );

          return res.status(201).json({
            success: true,
            message: `Sent a verification email to ${email}`,
          });
        } else if (type === "login") {
          // Login logic
          const user: User | null = await prisma.user.findUnique({ where: { email } });

          if (!user) {
            throw new Error("No user found, please register.");
          }

          if (!user.verified) {
            jwt.sign(
              { user: user.id },
              JWT_SECRET,
              { expiresIn: "1d" },
              (err, emailToken) => {
                if (err) throw err;
                sendMail(email, user.name, emailToken, "confirmation");
              }
            );
            throw new Error(
              "Your email is not verified. A verification link has been sent to your email."
            );
          }

          if (provider === "credentials") {
            const passwordMatch = await comparePassword(password!, user.password);

            if (!passwordMatch) {
              throw new Error("Incorrect Password");
            }
          }

          jwt.sign(
            {
              email: user.email,
              id: user.id,
              name: user.name,
              defaultWorkspace: user.defaultWorkspaceId,
              lastLogin: user.lastLogin,
              workspaces: user.workspaces,
            },
            JWT_SECRET,
            {},
            async (error, token) => {
              if (error) throw error;
              res.cookie("token", token);

              await user.populate("workspaces");
              const workspace = user.workspaces[0];

              if (!user.onBoarding || !workspace) {
                return res.json({
                  user,
                  redirectTo: "/onboarding",
                });
              }

              return res.json({
                user,
                redirectTo: workspace.url,
              });
            }
          );
        }
      } catch (error) {
        console.error("Error with auth request:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  };
}
