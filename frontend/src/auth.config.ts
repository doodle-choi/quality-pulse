import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/admin");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return true;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Security: Fail securely if no admin password is provided in environment
        if (!adminEmail || !adminPassword) {
          console.error("ADMIN_EMAIL or ADMIN_PASSWORD not set in environment.");
          return null;
        }

        if (credentials.email === adminEmail && credentials.password === adminPassword) {
          return { id: "1", name: "Admin User", email: adminEmail, role: "ADMIN" };
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
