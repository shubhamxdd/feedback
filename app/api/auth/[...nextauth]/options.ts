import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { compare } from "bcryptjs";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Identifier",
          placeholder: "shubhamxd",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      async authorize(credentials: any): Promise<any> {
        await db();

        try {
          const user = await User.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email/username");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email first");
          }

          const isValidPassword = await compare(
            credentials?.password as string,
            user.password
          );

          if (isValidPassword) {
            return user;
          } else {
            throw new Error("Invalid password");
          }
        } catch (error) {
          console.log("Error in credentials", error);
          throw new Error("Error in credentials");
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // DISABLE WHEN DEPLOYING
  // debug: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAllowingNewMessages = user.isAllowingNewMessages;
        token.username = user.username;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAllowingNewMessages = token.isAllowingNewMessages;
        session.user.username = token.username;
      }

      return session;
    },
  },
};
