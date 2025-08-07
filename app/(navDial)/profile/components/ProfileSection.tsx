import React, { memo } from "react";
import { ProfileData } from "@/app/schemas/profileSchema";
import { SECTION_STYLES } from "../utils/constants";

interface InfoRowProps {
  label: string;
  value: string | null | undefined;
}

const InfoRow = memo(function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="font-medium text-gray-400">{label}:</span>
      <span className="text-white">{value || "—"}</span>
    </div>
  );
});

interface SectionIconProps {
  type: "contact" | "id" | "events";
  className: string;
}

const SectionIcon = memo(function SectionIcon({
  type,
  className,
}: SectionIconProps) {
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
    <svg
      className={`w-5 h-5 mr-2 ${className}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      {icons[type]}
    </svg>
  );
});

interface ContactSectionProps {
  profile: ProfileData;
}

export const ContactSection = memo(function ContactSection({
  profile,
}: ContactSectionProps) {
  return (
    <div className={SECTION_STYLES.card}>
      <h2 className={`${SECTION_STYLES.sectionTitle} text-blue-400`}>
        <SectionIcon type="contact" className="text-blue-400" />
        Contact & Education
      </h2>
      <div className={SECTION_STYLES.infoGrid}>
        <InfoRow label="Name" value={profile.name} />
        <InfoRow label="Gender" value={profile.gender || "Not Provided"} />

        <InfoRow label="Email" value={profile.email} />
        <InfoRow
          label="College"
          value={profile.college_name || "Not provided"}
        />
        <InfoRow
          label="Location"
          value={
            profile.city && profile.state
              ? `${profile.city}, ${profile.state}`
              : "Not provided"
          }
        />
      </div>
    </div>
  );
});

interface IdentificationSectionProps {
  profile: ProfileData;
}

export const IdentificationSection = memo(function IdentificationSection({
  profile,
}: IdentificationSectionProps) {
  return (
    <div className={SECTION_STYLES.card}>
      <h2 className={`${SECTION_STYLES.sectionTitle} text-green-400`}>
        <SectionIcon type="id" className="text-green-400" />
        Identification
      </h2>
      <div className={SECTION_STYLES.infoGrid}>
        <InfoRow
          label="College ID"
          value={profile.college_id || "Not provided"}
        />
        <InfoRow
          label="Sphinx ID"
          value={profile.sphinx_id || "Not provided"}
        />
        <InfoRow label="Ticket ID" value={profile.ticketID || "Unavailible"} />
      </div>
    </div>
  );
});

interface EventsSectionProps {
  events: string[];
}

export const EventsSection = memo(function EventsSection({
  events,
}: EventsSectionProps) {
  return (
    <div className={SECTION_STYLES.card}>
      <h2 className={`${SECTION_STYLES.sectionTitle} text-purple-400`}>
        <SectionIcon type="events" className="text-purple-400" />
        Registered Events
      </h2>
      <div className="space-y-2">
        {events.length > 0 ? (
          events.map((event, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-2 text-sm text-gray-200"
            >
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
