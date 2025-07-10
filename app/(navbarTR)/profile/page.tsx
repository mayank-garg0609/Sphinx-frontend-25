"use client";

import React, { useEffect, useState, useCallback, memo, useMemo } from "react";
import Image from "next/image";
import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";
import profileBG from "@/public/image/profileBG.webp";
import {
  registrationSchema,
  RegistrationData,
} from "@/app/schemas/registrationSchema";
import { slideInOut } from "@/app/animations/pageTrans";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const PROFILE_STYLES = {
  container: "relative min-h-screen bg-black overflow-hidden",
  backgroundOverlay: "absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/20 lg:from-black/80 lg:via-black/60 lg:to-transparent z-1",
  mobileCard: "w-full max-w-md bg-black/40 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/10",
  desktopCard: "ml-16 xl:ml-24 w-full max-w-xl bg-black/30 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/10",
  mobileWrapper: "lg:hidden relative z-10 min-h-screen flex items-center justify-center p-4",
  desktopWrapper: "hidden lg:flex relative z-10 min-h-screen items-center",
} as const;

const SECTION_STYLES = {
  card: "bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10",
  sectionTitle: "text-lg font-semibold mb-3 flex items-center",
  infoGrid: "space-y-2 text-sm text-gray-300",
} as const;

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

interface UserData {
  sphinx_id: string;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  applied_ca: boolean;
}

const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem("auth_token");
  } catch {
    return null;
  }
};

const getUserData = (): UserData | null => {
  try {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

const clearAuthData = (): void => {
  try {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  } catch {
  }
};

const fetchProfileData = async (token: string): Promise<RegistrationData> => {
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    throw new Error(`Server returned non-JSON response: ${response.status}`);
  }

  const result: ApiResponse<RegistrationData> = await response.json();

  if (!response.ok) {
    throw new Error(result.error || `HTTP error! status: ${response.status}`);
  }

  return result.data as RegistrationData;
};

const handleApiError = (error: Error, router: ReturnType<typeof useTransitionRouter>): void => {
  const message = error.message;

  if (message.includes("401") || message.includes("Unauthorized")) {
    toast.error("Session expired. Please log in again.");
    clearAuthData();
    router.push("/login", { onTransitionReady: slideInOut });
  } else if (message.includes("403")) {
    toast.error("Access denied. Please check your permissions.");
  } else if (message.includes("404")) {
    toast.error("Profile not found. Please contact support.");
  } else if (message.includes("non-JSON response")) {
    toast.error("Server configuration error. Please try again later.");
  } else if (message.includes("NetworkError") || message.includes("fetch")) {
    toast.error("Network error. Please check your connection and try again.");
  } else {
    toast.error(message || "Failed to load profile. Please try again.");
  }
};

const LoadingSpinner = memo(function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      <p className="text-lg font-semibold animate-pulse">Loading profile...</p>
    </div>
  );
});

const ErrorMessage = memo(function ErrorMessage({ error }: { error: string }) {
  return (
    <div className="text-red-400 bg-red-900/30 p-4 rounded-lg border border-red-500/50 backdrop-blur-sm">
      <div className="flex items-center justify-center space-x-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span>{error}</span>
      </div>
    </div>
  );
});

const ProfileAvatar = memo(function ProfileAvatar({ name }: { name: string }) {
  const initials = useMemo(() => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }, [name]);

  return (
    <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
      <span className="text-2xl lg:text-3xl font-bold text-white">
        {initials}
      </span>
    </div>
  );
});

const InfoRow = memo(function InfoRow({ 
  label, 
  value 
}: { 
  label: string; 
  value: string 
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="font-medium text-gray-400">{label}:</span>
      <span className="text-white">{value}</span>
    </div>
  );
});

const SectionIcon = memo(function SectionIcon({ 
  type, 
  className 
}: { 
  type: 'contact' | 'id' | 'events';
  className: string;
}) {
  const icons = {
    contact: (
      <>
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </>
    ),
    id: (
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    ),
    events: (
      <path
        fillRule="evenodd"
        d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    ),
  };

  return (
    <svg className={`w-5 h-5 mr-2 ${className}`} fill="currentColor" viewBox="0 0 20 20">
      {icons[type]}
    </svg>
  );
});

const ContactSection = memo(function ContactSection({ 
  profile 
}: { 
  profile: RegistrationData 
}) {
  return (
    <div className={SECTION_STYLES.card}>
      <h2 className={`${SECTION_STYLES.sectionTitle} text-blue-400`}>
        <SectionIcon type="contact" className="text-blue-400" />
        Contact & Education
      </h2>
      <div className={SECTION_STYLES.infoGrid}>
        <InfoRow label="Email" value={profile.email} />
        <InfoRow label="College" value={profile.collegeName} />
        <InfoRow label="Location" value={`${profile.city}, ${profile.state}`} />
      </div>
    </div>
  );
});

const IdentificationSection = memo(function IdentificationSection({ 
  profile 
}: { 
  profile: RegistrationData 
}) {
  return (
    <div className={SECTION_STYLES.card}>
      <h2 className={`${SECTION_STYLES.sectionTitle} text-green-400`}>
        <SectionIcon type="id" className="text-green-400" />
        Identification
      </h2>
      <div className={SECTION_STYLES.infoGrid}>
        <InfoRow label="College ID" value={profile.collegeId} />
        <InfoRow label="Sphinx ID" value={profile.sphinxId} />
        <InfoRow label="Ticket ID" value={profile.ticketID} />
      </div>
    </div>
  );
});

const EventsSection = memo(function EventsSection({ 
  events 
}: { 
  events: string[] 
}) {
  return (
    <div className={SECTION_STYLES.card}>
      <h2 className={`${SECTION_STYLES.sectionTitle} text-purple-400`}>
        <SectionIcon type="events" className="text-purple-400" />
        Registered Events
      </h2>
      <div className="space-y-2">
        {events.length > 0 ? (
          events.map((event, idx) => (
            <div key={idx} className="flex items-center space-x-2 text-sm text-gray-200">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>{event}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No events registered yet.</p>
        )}
      </div>
    </div>
  );
});

const RefreshButton = memo(function RefreshButton({
  onRefresh,
  isRefreshing,
}: {
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  return (
    <button
      onClick={onRefresh}
      disabled={isRefreshing}
      className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
    >
      <svg
        className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
    </button>
  );
});

const ProfileContent = memo(function ProfileContent({
  loading,
  error,
  profile,
  onRefresh,
  isRefreshing,
}: {
  loading: boolean;
  error: string | null;
  profile: RegistrationData | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
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
        <ErrorMessage error={error} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-white">
        <p className="text-gray-400">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4 text-white">
      <RefreshButton onRefresh={onRefresh} isRefreshing={isRefreshing} />
      
      <div className="mb-6">
        <ProfileAvatar name={profile.name} />
        <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {profile.name}
        </h1>
      </div>

      <div className="space-y-4 text-left">
        <ContactSection profile={profile} />
        <IdentificationSection profile={profile} />
        <EventsSection events={profile.eventsRegisteredIn} />
      </div>
    </div>
  );
});

const ProfilePage: React.FC = () => {
  const router = useTransitionRouter();
  const [profile, setProfile] = useState<RegistrationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadProfile = useCallback(async (showRefreshing: boolean = false): Promise<void> => {
    const token = getAuthToken();
    const userData = getUserData();

    if (!token || !userData) {
      setError("Please log in to view your profile.");
      setLoading(false);
      setTimeout(() => {
        router.push("/login", { onTransitionReady: slideInOut });
      }, 2000);
      return;
    }

    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError(null);

      const data = await fetchProfileData(token);
      const parsed = registrationSchema.safeParse(data);
      
      if (!parsed.success) {
        console.error("Profile validation error:", parsed.error.format());
        setError("Invalid profile data received from server.");
      } else {
        setProfile(parsed.data);
        if (showRefreshing) {
          toast.success("Profile refreshed successfully!");
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error occurred");
      handleApiError(error, router);
      setError(error.message || "Failed to load profile.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [router]);

  const handleRefresh = useCallback((): void => {
    if (!isRefreshing) {
      loadProfile(true);
    }
  }, [loadProfile, isRefreshing]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

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
          <ProfileContent
            loading={loading}
            error={error}
            profile={profile}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </div>
      </div>

      <div className={PROFILE_STYLES.desktopWrapper}>
        <div className={PROFILE_STYLES.desktopCard}>
          <ProfileContent
            loading={loading}
            error={error}
            profile={profile}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;