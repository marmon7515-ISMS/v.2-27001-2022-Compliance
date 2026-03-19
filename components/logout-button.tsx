"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST"
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <button className="rounded-xl border px-3 py-2 text-sm" onClick={logout}>
      Esci
    </button>
  );
}
