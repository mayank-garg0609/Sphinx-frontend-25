import { President, VicePresident, GenSec, TechSec } from "../data/team";
import TeamsCard from "@/app/components/teamCard";
import { TeamMember } from "../types/teamTypes";

export default function CoreTeam() {
  return (
    <>
      <div className="flex flex-wrap gap-8 justify-center pt-8 pb-8">
        {President.map((card: TeamMember) => (
          <TeamsCard key={card.id} {...card} />
        ))}
      </div>
      <div className="flex flex-wrap gap-16 justify-center pt-8 pb-8" >
        {VicePresident.map((card: TeamMember) => (
          <TeamsCard key={card.id} {...card} />
        ))}
      </div>
      <div className="flex flex-wrap gap-16 justify-center pt-8 pb-8">
        {GenSec.map((card: TeamMember) => (
          <TeamsCard key={card.id} {...card} />
        ))}
      </div>
      <div className="flex flex-wrap gap-16 justify-center pt-8 pb-8">
        {TechSec.map((card: TeamMember) => (
          <TeamsCard key={card.id} {...card} />
        ))}
      </div>
    </>
  );
}
