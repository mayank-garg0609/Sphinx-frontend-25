import React, { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTransitionRouter } from "next-view-transitions";
import { slideInOut } from "@/app/animations/pageTrans";
import logo from "@/public/image/logo.webp";
import { LOGO_SIZE } from "../types/constants";

interface LogoProps {
  currentPath: string;
}

export const Logo = React.memo<LogoProps>(
  ({ currentPath }) => {
    const router = useTransitionRouter();
    const isActive = currentPath === "/";

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (!isActive) {
          router.push("/", { onTransitionReady: slideInOut });
        }
      },
      [router, isActive]
    );

    return (
      <div className="flex items-center gap-2 justify-center lg:mx-0">
        <Link
          onClick={handleClick}
          href="/"
          className={isActive ? "cursor-not-allowed opacity-50" : ""}
          aria-disabled={isActive}
        >
          <h1 className="text-3xl font-bold text-white">Sphinx'25</h1>
        </Link>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.currentPath === nextProps.currentPath;
  }
);

Logo.displayName = "Logo";
