import React, { memo } from "react";
import { RegistrationData } from "@/app/schemas/registrationSchema";
import { ProfileAvatar } from "./ProfileAvatar";
import {
  ContactSection,
  IdentificationSection,
  EventsSection,
} from "./ProfileSection";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { RefreshButton } from "./RefreshButton";

interface ProfileContentProps {
  loading: boolean;
  error: string | null;
  profile: RegistrationData | null;
  onRefresh: () => void;
  onRetry: () => void;
  isRefreshing: boolean;
  canRetry: boolean;
}

const ProfileContent = memo(function ProfileContent({
  loading,
  error,
  profile,
  onRefresh,
  onRetry,
  isRefreshing,
  canRetry,
}: ProfileContentProps) {
  if (loading) {
    return (
      <div className="text-center text-white">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-white">
        <ErrorMessage error={error} onRetry={onRetry} canRetry={canRetry} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-white">
        <div className="flex flex-col items-center space-y-3">
          <p className="text-gray-400">No profile data available.</p>
          {canRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Try Loading Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4 text-white">
      <RefreshButton
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
        canRefresh={canRetry}
      />

      <div className="mb-6">
        <ProfileAvatar name={profile.name} />
        <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {profile.name}
        </h1>
      </div>

      <div className="space-y-4 text-left">
        <ContactSection profile={profile} />
        <IdentificationSection profile={profile} />
        <EventsSection events={profile.eventsRegisteredIn ?? []} />
      </div>
    </div>
  );
});

export default ProfileContent;
