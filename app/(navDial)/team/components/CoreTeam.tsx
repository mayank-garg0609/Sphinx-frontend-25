import React from "react";
import { President, VicePresident, GenSec, TechSec, CulSec, FinSec, LogSec, MarSec, PubSec, DecSec, MasSec, DesSec } from "../data/team";
import TeamsCard from "@/app/components/teamCard";
import { TeamMember } from "../types/teamTypes";

interface CoreTeamSectionConfig {
  data: readonly TeamMember[];
  gapSize: 'gap-8' | 'gap-16';
}

const CoreTeam: React.FC = React.memo(() => {
  const teamSections: CoreTeamSectionConfig[] = React.useMemo(() => [
    { data: President, gapSize: 'gap-8' },
    { data: VicePresident, gapSize: 'gap-16' },
    { data: GenSec, gapSize: 'gap-16' },
    { data: TechSec, gapSize: 'gap-16' },
    { data: CulSec, gapSize: 'gap-16' },
    { data: FinSec, gapSize: 'gap-16' },
    { data: LogSec, gapSize: 'gap-16' },
    { data: MarSec, gapSize: 'gap-16' },
    { data: DecSec, gapSize: 'gap-16' },
    { data: PubSec, gapSize: 'gap-16' },
    { data: MasSec, gapSize: 'gap-16' },
    { data: DesSec, gapSize: 'gap-16' },
  ].filter((section): section is CoreTeamSectionConfig => 
    Boolean(section.data && section.data.length > 0)
  ), []);

  return (
    <section aria-label="Core team members">
      {teamSections.map((section, index) => (
        <div 
          key={`team-section-${index}`}
          className={`flex flex-wrap ${section.gapSize} justify-center pt-8 pb-8`}
        >
          {section.data.map((member: TeamMember) => (
            <TeamsCard 
              key={`${member.id}-${member.subtitle.toLowerCase().replace(/\s+/g, '-')}`} 
              {...member} 
            />
          ))}
        </div>
      ))}
    </section>
  );
});

CoreTeam.displayName = "CoreTeam";

export default CoreTeam;