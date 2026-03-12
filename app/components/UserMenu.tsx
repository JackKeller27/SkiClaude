"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") return null;

  if (!session) {
    return (
      <a
        href="/login"
        className="text-xs px-3 py-1.5 rounded bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors"
      >
        Sign in
      </a>
    );
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2">
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "User"}
            width={30}
            height={30}
            className="rounded-full ring-2 ring-slate-600"
          />
        ) : (
          <div className="w-[30px] h-[30px] rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold">
            {session.user?.name?.[0] ?? "?"}
          </div>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg py-1 w-44 z-50 text-sm">
          <div className="px-3 py-2 text-gray-500 text-xs border-b truncate">
            {session.user?.email}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
