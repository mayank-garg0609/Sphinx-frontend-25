"use client";

import React, { useCallback } from "react";
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
    authStatus 
  } = useUser();
  
  const {
    profile,
    loading,
    error,
    canRetry,
    handleRetry,
    isRefreshing
  } = useProfile();

  const handleLogin = useCallback((): void => {
    router.push("/login", { onTransitionReady: slideInOut });
  }, [router]);

  if (userLoading) {
    console.log("🔄 User authentication loading...", {
      userLoading,
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
              <p className="text-sm text-gray-400 mt-2">Authenticating...</p>
            </div>
          </div>
        </div>

        <div className={PROFILE_STYLES.desktopWrapper}>
          <div className={PROFILE_STYLES.desktopCard}>
            <div className="text-center text-white">
              <LoadingSpinner />
              <p className="text-sm text-gray-400 mt-2">Authenticating...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (!isLoggedIn) {
      console.log("🚫 User not logged in, showing login prompt", {
        isLoggedIn,
        hasUser: !!user,
        authStatus: authStatus.isAuthenticated
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