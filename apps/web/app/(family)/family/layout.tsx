"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FamilyLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("hs_role");
    if (role !== "family") {
      router.replace("/");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;
  return <>{children}</>;
}
