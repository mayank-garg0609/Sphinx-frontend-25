"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useTransitionRouter } from "next-view-transitions";
import { useUser } from "@/app/hooks/useUser/useUser";
import { slideInOut } from "@/app/animations/pageTrans";
import profileBG from "@/public/image/profileBG.webp";
import { useProfile } from "./hooks/useProfile";
import ProfileContent from "./components/ProfileContent";
import { LoginPrompt } from "./components/LoginPrompt";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { PROFILE_STYLES } from "./utils/constants";

const ProfilePage: React.FC = () => {
  const router = useTransitionRouter();
  const { 
    user, 
    isLoggedIn, 
    isLoading: userLoading, 
    authStatus,
    auth
  } = useUser();
  
  const {
    profile,
    loading,
    error,
    canRetry,
    handleRetry,
    isRefreshing
  } = useProfile();

  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  const handleLogin = useCallback((): void => {
    router.push("/login", { onTransitionReady: slideInOut });
  }, [router]);

  // Wait for initial auth check to complete
  useEffect(() => {
    if (!userLoading) {
      // Give a small delay to allow for automatic authentication attempts
      const timer = setTimeout(() => {
        setAuthCheckComplete(true);
      }, 1000); // 1 second delay

      return () => clearTimeout(timer);
    }
  }, [userLoading]);

  // Show loading spinner while authentication is being checked
  if (userLoading || !authCheckComplete) {
    console.log("🔄 Authentication check in progress...", {
      userLoading,
      authCheckComplete,
      isLoggedIn,
      hasUser: !!user,
      authStatus: authStatus.isAuthenticated
    });

    return (
      <div className={PROFILE_STYLES.container}>
        <div className="absolute inset-0 z-0">
          <Image
            src={profileBG}
            alt="Profile Background"
            priority
            fill
            className="object-cover object-center lg:object-right"
          />
        </div>
        
        <div className={PROFILE_STYLES.backgroundOverlay} />
        
        <div className={PROFILE_STYLES.mobileWrapper}>
          <div className={PROFILE_STYLES.mobileCard}>
            <div className="text-center text-white">
              <LoadingSpinner />
              <p className="text-sm text-gray-400 mt-2">Checking authentication...</p>
            </div>
          </div>
        </div>

        <div className={PROFILE_STYLES.desktopWrapper}>
          <div className={PROFILE_STYLES.desktopCard}>
            <div className="text-center text-white">
              <LoadingSpinner />
              <p className="text-sm text-gray-400 mt-2">Checking authentication...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    // If user has data but tokens are expired, try to refresh first
    if (user && !isLoggedIn && authStatus.tokenExpiry) {
      const isTokenExpired = Date.now() >= authStatus.tokenExpiry;
      
      if (isTokenExpired) {
        console.log("🔄 Token expired, attempting refresh...");
        
        // Attempt session refresh
        auth.refreshSession().then((success) => {
          if (!success) {
            console.log("❌ Session refresh failed, will show login prompt");
          } else {
            console.log("✅ Session refreshed successfully");
          }
        }).catch((error) => {
          console.error("❌ Session refresh error:", error);
        });

        return (
          <div className="text-center text-white">
            <LoadingSpinner />
            <p className="text-sm text-gray-400 mt-2">Refreshing session...</p>
          </div>
        );
      }
    }

    if (!isLoggedIn) {
      console.log("🚫 User not logged in, showing login prompt", {
        isLoggedIn,
        hasUser: !!user,
        authStatus: authStatus.isAuthenticated,
        tokenExpiry: authStatus.tokenExpiry
      });
      return <LoginPrompt onLogin={handleLogin} />;
    }

    console.log("✅ User authenticated, rendering profile content", {
      userId: user?.sphinx_id,
      userName: user?.name,
      profileLoaded: !!profile,
      isLoading: loading,
      isRefreshing,
      hasError: !!error
    });

    return (
      <ProfileContent
        loading={loading}
        error={error}
        profile={profile}
        onRetry={handleRetry}
        canRetry={canRetry}
      />
    );
  };

  return (
    <div className={PROFILE_STYLES.container}>
      <div className="absolute inset-0 z-0">
        <Image
          src={profileBG}
          alt="Profile Background"
          priority
          fill
          className="object-cover object-center lg:object-right"
        />
      </div>
      
      <div className={PROFILE_STYLES.backgroundOverlay} />

      <div className={PROFILE_STYLES.mobileWrapper}>
        <div className={PROFILE_STYLES.mobileCard}>
          {renderContent()}
        </div>
      </div>

      <div className={PROFILE_STYLES.desktopWrapper}>
        <div className={PROFILE_STYLES.desktopCard}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;