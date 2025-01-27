"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}


/*
Iska primary purpose hai ki ye Next.js ke NextAuth
 library ka SessionProvider use karke authentication ka context provide kare.
*/