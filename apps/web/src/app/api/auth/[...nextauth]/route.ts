import NextAuth from "next-auth/next";
import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import axios from "axios";
import type { DefaultNextUser } from "@/app/interfaces/Auth.interfaces";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

// Function to fetch secret from AWS Secrets Manager
export const getSecretValue = async (
  secretName: string
): Promise<string> => {
  const client = new SecretsManagerClient();
  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: secretName,
    })
  );
  if (response.SecretString) {
    return response.SecretString;
  }

  if (response.SecretBinary) {
    return response.SecretBinary.toString();
  }
  return "No Secret Found";
};

// Fetch all necessary secrets and environment variables
const getSecrets = async () => {
  const [
    googleClientId,
    googleClientSecret,
    githubClientId,
    githubClientSecret,
    nextAuthSecret,
  ] = await Promise.all([
    process.env.GOOGLE_CLIENT_ID ??
      getSecretValue("GOOGLE_CLIENT_ID"),
    process.env.GOOGLE_CLIENT_SECRET ??
      getSecretValue("GOOGLE_CLIENT_SECRET"),
    process.env.GITHUB_CLIENT_ID ??
      getSecretValue("GITHUB_CLIENT_ID"),
    process.env.GITHUB_CLIENT_SECRET ??
      getSecretValue("GITHUB_CLIENT_SECRET"),
    process.env.NEXTAUTH_SECRET ?? getSecretValue("NEXTAUTH_SECRET"),
  ]);

  return {
    googleClientId,
    googleClientSecret,
    githubClientId,
    githubClientSecret,
    nextAuthSecret,
  };
};

// Main async function to configure NextAuth
const configureAuthOptions = async (): Promise<AuthOptions> => {
  const {
    googleClientId,
    googleClientSecret,
    githubClientId,
    githubClientSecret,
    nextAuthSecret,
  } = await getSecrets();

  if (
    !googleClientId ||
    !googleClientSecret ||
    !githubClientId ||
    !githubClientSecret ||
    !nextAuthSecret
  ) {
    const missingEnvs = [];
    if (!googleClientId) missingEnvs.push("GOOGLE_CLIENT_ID");
    if (!googleClientSecret) missingEnvs.push("GOOGLE_CLIENT_SECRET");
    if (!githubClientId) missingEnvs.push("GITHUB_CLIENT_ID");
    if (!githubClientSecret) missingEnvs.push("GITHUB_CLIENT_SECRET");
    if (!nextAuthSecret) missingEnvs.push("NEXTAUTH_SECRET");
    throw new Error(
      `Missing environment variables: ${missingEnvs.join(", ")}. Please add them to your .env file or Secrets Manager.`
    );
  }

  return {
    providers: [
      GoogleProvider({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        authorization: {
          params: {
            prompt: "consent",
          },
        },
      }),
      GithubProvider({
        clientId: githubClientId,
        clientSecret: githubClientSecret,
        authorization: {
          params: {
            prompt: "consent",
          },
        },
      }),
    ],
    secret: nextAuthSecret,
    callbacks: {
      async signIn({ user, account }) {
        if (
          account &&
          (account.provider === "google" ||
            account.provider === "github")
        ) {
          (user as DefaultNextUser).ghToken = account.access_token;
          try {
            const { data } = await axios({
              method: "POST",
              url: `${process.env.NEXT_PUBLIC_SERVER}/auth/signInUsingNextAuth`,
              data: { email: user?.email },
              withCredentials: true,
            });
            const userData = data.user;
            if (userData) {
              user.userData = userData;
              return true;
            }
            return false;
          } catch (error) {
            return "/login";
          }
        }
        return false;
      },
      async session({ session, token }) {
        if (token?.userData) {
          session.userData = token.userData;
        }
        return session;
      },
      async jwt({ token, user }) {
        if (user?.userData) {
          token.userData = user.userData;
        }
        return token;
      },
    },
  };
};

// Export the NextAuth handler
export default async function handler(req: Request, res: Response) {
  const authOptions = await configureAuthOptions();
  return NextAuth(req, res, authOptions);
}

export { handler as GET, handler as POST };
