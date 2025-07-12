import React, { useCallback, useMemo } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { slideInOut } from "@/app/animations/pageTrans";
import { iconComponents } from "./icons";
import { useUser } from "@/app/hooks/useUser/useUser";
import { logoutUser } from "@/app/hooks/useUser/utils/helperFunctions";

interface UserButtonProps {
  mobile?: boolean;
  onClick?: () => void;
  currentPath: string;
}

export const UserButton = React.memo<UserButtonProps>(
  ({ mobile = false, onClick, currentPath }) => {
    const userContext = useUser();
    const router = useTransitionRouter();
    const { FaUser } = iconComponents;

    const { user, isLoggedIn = false, isLoading = false } = userContext || {};

    const handleLogout = useCallback(async () => {
      try {
        await logoutUser();
        router.push("/login", { onTransitionReady: slideInOut });
        console.log("User logged out successfully");
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }, [router]);

    const handleSignUp = useCallback(() => {
      router.push("/sign-up", { onTransitionReady: slideInOut });
    }, [router]);

    const handleClick = useCallback(
      async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (isLoading) return;

        if (isLoggedIn) {
          await handleLogout();
        } else {
          handleSignUp();
        }
        if (onClick) onClick();
      },
      [isLoggedIn, isLoading, handleLogout, handleSignUp, onClick]
    );

    const buttonClassName = useMemo(() => {
      const baseClass = mobile
        ? `mt-6 w-80 h-20 py-3 border border-white rounded-xl text-2xl font-semibold 
         bg-transparent text-white hover:bg-white hover:text-black 
         transition-all duration-200 ease-in-out active:scale-95 
         active:bg-[#3fe0b2] active:text-black shadow-md 
         hover:shadow-[0_0_15px_2px_rgba(63,224,178,0.6)] 
         active:shadow-[0_0_20px_4px_rgba(63,224,178,0.8)] text-center`
        : `navbar-link px-4 border border-white text-white rounded-md hover:bg-white hover:text-black transition-colors z-55`;

      return isLoading
        ? `${baseClass} opacity-50 cursor-not-allowed`
        : baseClass;
    }, [mobile, isLoading]);

    const displayName = useMemo(() => {
      if (isLoading) return "Loading...";
      return isLoggedIn ? "Logout" : "Sign Up";
    }, [isLoggedIn, isLoading]);

    return (
      <button
        className={`${buttonClassName} flex items-center justify-center gap-2`}
        disabled={isLoading}
        onClick={handleClick}
        aria-label={isLoggedIn ? "Logout from account" : "Sign up for account"}
      >
        {isLoggedIn && !mobile && <FaUser size={16} />}
        <span className="text-center">{displayName}</span>
      </button>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.mobile === nextProps.mobile &&
      prevProps.currentPath === nextProps.currentPath
    );
  }
);

UserButton.displayName = "UserButton";
