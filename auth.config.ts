import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Lightweight config — no database imports, safe for middleware/edge runtime
export const authConfig: NextAuthConfig = {
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
