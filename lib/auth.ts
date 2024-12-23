import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
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
// USER finding from DB 
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password //the hash that has been saved inside database
        );

        if (!passwordMatch) {
          throw new Error("Incorrect password");
        }
// matched pwd..successfully
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
// callbacks: {
//   async jwt({ token, user }) {
//     if (user) {
//       token.role = user.role;
//     }
//     return token;
//   },
//   async session({ session, token }) {
//     if (session?.user) {
//       session.user.role = token.role;
//     }
//     return session;
//   },
// },

  //a Json web token to uh to be stored
// inside the sectoion so that when the user refreshes  the page ,they still stayed logged in... in our platform
 
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
};
