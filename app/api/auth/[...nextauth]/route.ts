// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

/*
use //@ts-nocheck at top - mk 
*/

const handler = NextAuth({
    adapter: PrismaAdapter(prisma), // to connect NextAuth to the Prisma ORM
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please enter an email and password");
          }
  
          const user = await prisma.user.findUnique({ //Prisma's findUnique method to query the database for a user with the provided email
            where: {
              email: credentials.email,
            },
          });
  
          if (!user) {
            throw new Error("No user found with this email");
          }
  
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
  
          if (!passwordMatch) {
            throw new Error("Incorrect password");
          }
  
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.role = user.role;
        }
        return token;
      },
      async session({ session, token }) {
        if (session?.user) {
          session.user.role = token.role;
        }
        return session;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
    session: {
      strategy: "jwt",
    },
  });
  
  export { handler as GET, handler as POST };
  /*
This code sets up a custom email/password authentication system using NextAuth with Prisma as the database adapter.
 It checks the user’s credentials, hashes passwords securely, and creates a JWT session with the user’s role. 
If successful, it provides the user with a session; otherwise, it returns appropriate error messages.
  */