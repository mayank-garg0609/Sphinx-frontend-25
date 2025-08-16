import React from "react";
import { TeamSection } from "../types/teamTypes";
import TeamsCard from "@/app/components/teamCard";
import { Advisors } from "../data/team";
import CoreTeam from "./CoreTeam";

interface TeamContentProps {
  view: TeamSection;
}

const TeamContent: React.FC<TeamContentProps> = React.memo(({ view }) => {
  const renderContent = React.useCallback(() => {
    switch (view) {
      case "core":
        return <CoreTeam />;
      case "advisors":
        if (!Advisors || Advisors.length === 0) {
          return (
            <div className="text-center py-8">
              <p className="text-white/70">No advisors information available.</p>
            </div>
          );
        }
        return (
          <section aria-label="Team advisors" className="flex flex-col gap-8 justify-center pt-8">
            {Advisors.map((advisor) => (
              <TeamsCard key={`advisor-${advisor.id}`} {...advisor} />
            ))}
          </section>
        );
      default:
        return null;
    }
  }, [view]);

  return (
    <main className="relative z-10 text-white px-6 sm:px-10 flex flex-col items-center justify-center mt-32 lg:mt-44">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-center">Meet the Team</h1>
      </header>
      {renderContent()}
    </main>
  );
});

TeamContent.displayName = "TeamContent";

export default TeamContent;