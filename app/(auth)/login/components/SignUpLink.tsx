import { memo, useCallback } from "react";
import Link from "next/link";
import { useTransitionRouter } from "next-view-transitions";
import { slideInOut } from "@/app/animations/pageTrans";

export const SignUpLink = memo(function SignUpLink() {
  const router = useTransitionRouter();

  const handleSignUpClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      router.push("/sign-up", { onTransitionReady: slideInOut });
    },
    [router]
  );

  return (
    <div className="text-center text-xs lg:text-sm text-zinc-400 mt-2 lg:mt-2">
      Don't have an account?{" "}
      <Link
        href="/sign-up"
        onClick={handleSignUpClick}
        className="text-blue-400 hover:underline font-medium"
      >
        Sign Up
      </Link>
    </div>
  );
});