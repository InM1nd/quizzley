import NextAuth, { type Session, type User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db/index";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: Session; user?: User }) {
      if (user && session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  debug: true,
  logger: {
    error: (code, ...message) => {
      console.error(code, message);
    },
    warn: (code, ...message) => {
      console.warn(code, message);
    },
    debug: (code, ...message) => {
      console.debug(code, message);
    },
  },
});
