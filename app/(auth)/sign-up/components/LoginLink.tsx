import { memo, useCallback } from "react";
import Link from "next/link";
import { useTransitionRouter } from "next-view-transitions";
import { slideInOut } from "@/app/animations/pageTrans";

export const LoginLink = memo(function LoginLink() {
  const router = useTransitionRouter();

  const handleLoginClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      router.push("/login", { onTransitionReady: slideInOut });
    },
    [router]
  );

  return (
    <div className="text-center text-xs lg:text-sm text-zinc-400 mt-2 lg:mt-2">
      Already have an account?{" "}
      <Link
        href="/login"
        onClick={handleLoginClick}
        className="text-blue-400 hover:underline font-medium"
      >
        Log In
      </Link>
    </div>
  );
});