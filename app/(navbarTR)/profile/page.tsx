"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import profileBG from "@/public/image/profileBG.webp";
import {
  registrationSchema,
  RegistrationData,
} from "@/app/schemas/registrationSchema";

const getProfileData = async (): Promise<unknown> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        name: "John Doe",
        email: "example@email.com",
        collegeName: "IIT Madras",
        city: "Chennai",
        state: "Tamil Nadu",
        collegeId: "C12345",
        sphinxId: "SPX2025_001",
        eventsRegisteredIn: ["Robowars", "Hackathon"],
        ticketID: "zeta",
      });
    }, 1200)
  );
};

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<RegistrationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProfileData();
        const parsed = registrationSchema.safeParse(data);
        if (!parsed.success) {
          setError("Invalid profile data received.");
          console.error(parsed.error.format());
        } else {
          setProfile(parsed.data);
        }
      } catch {
        setError("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image 
          src={profileBG} 
          alt="Profile Background" 
          priority 
          fill 
          className="object-cover object-center lg:object-right"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/20 lg:from-black/80 lg:via-black/60 lg:to-transparent z-1" />
      
      <div className="lg:hidden relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-black/40 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/10">
          <ProfileContent loading={loading} error={error} profile={profile} />
        </div>
      </div>

      <div className="hidden lg:flex relative z-10 min-h-screen items-center">
        <div className="ml-16 xl:ml-24 w-full max-w-xl bg-black/30 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/10">
          <ProfileContent loading={loading} error={error} profile={profile} />
        </div>
      </div>
    </div>
  );
};

const ProfileContent: React.FC<{
  loading: boolean;
  error: string | null;
  profile: RegistrationData | null;
}> = ({ loading, error, profile }) => {
  return (
    <div className="text-center space-y-4 text-white">
      {loading && (
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <p className="text-lg font-semibold animate-pulse">
            Loading profile...
          </p>
        </div>
      )}
      
      {error && (
        <div className="text-red-400 bg-red-900/30 p-4 rounded-lg border border-red-500/50 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {!loading && profile && (
        <>
          <div className="mb-6">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl lg:text-3xl font-bold text-white">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {profile.name}
            </h1>
          </div>

          <div className="space-y-4 text-left">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <h2 className="text-lg font-semibold mb-3 text-blue-400 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Contact & Education
              </h2>
              <div className="space-y-2 text-sm text-gray-300">
                <InfoRow label="Email" value={profile.email} />
                <InfoRow label="College" value={profile.collegeName} />
                <InfoRow label="Location" value={`${profile.city}, ${profile.state}`} />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <h2 className="text-lg font-semibold mb-3 text-green-400 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Identification
              </h2>
              <div className="space-y-2 text-sm text-gray-300">
                <InfoRow label="College ID" value={profile.collegeId} />
                <InfoRow label="Sphinx ID" value={profile.sphinxId} />
                <InfoRow label="Ticket ID" value={profile.ticketID} />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <h2 className="text-lg font-semibold mb-3 text-purple-400 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Registered Events
              </h2>
              <div className="space-y-2">
                {profile.eventsRegisteredIn.map((event, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm text-gray-200">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>{event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="font-medium text-gray-400">{label}:</span>
    <span className="text-white">{value}</span>
  </div>
);

export default ProfilePage;