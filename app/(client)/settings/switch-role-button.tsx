"use client";

import { useTransition } from "react";
import { switchRole } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function SwitchRoleButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    startTransition(async () => {
      const result = await switchRole("cook");
      if (result.success) {
        router.push("/cook");
      }
    });
  }

  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isPending && <Loader2 className="animate-spin" />}
      Стать поваром
    </Button>
  );
}
