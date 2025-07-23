import { President, VicePresident, GenSec, TechSec ,CulSec,FinSec,LogSec,MarSec,PubSec,DecSec,MasSec,DesSec} from "../data/team";
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
      <div className="flex flex-wrap gap-16 justify-center pt-8 pb-8">
        {CulSec.map((card: TeamMember) => (
          <TeamsCard key={card.id} {...card} />
        ))}
      </div>
      <div className="flex flex-wrap gap-16 justify-center pt-8 pb-8">
        {FinSec.map((card: TeamMember) => (
          <TeamsCard key={card.id} {...card} />
        ))}
      </div>
      <div className="flex flex-wrap gap-16 justify-center pt-8 pb-8">
        {LogSec.map((card: TeamMember) => (
          <TeamsCard key={card.id} {...card} />
        ))}
      </div>
      <div className="flex flex-wrap gap-16 justify-center pt-8 pb-8">
        {MarSec.map((card: TeamMember) => (
          <TeamsCard key={card.id} {...card} />
        ))}
      </div>
      <div className="flex flex-wrap gap-16 justify-center pt-8 pb-8">
        {DecSec.map((card: TeamMember) => (
          <TeamsCard key={card.id} {...card} />
        ))}
      </div>
      <div className="flex flex-wrap gap-16 justify-center pt-8 pb-8">
        {PubSec.map((card: TeamMember) => (
          <TeamsCard key={card.id} {...card} />
        ))}
      </div>
      <div className="flex flex-wrap gap-16 justify-center pt-8 pb-8">
        {MasSec.map((card: TeamMember) => (
          <TeamsCard key={card.id} {...card} />
        ))}
      </div>
      <div className="flex flex-wrap gap-16 justify-center pt-8 pb-8">
        {DesSec.map((card: TeamMember) => (
          <TeamsCard key={card.id} {...card} />
        ))}
      </div>
    </>
  );
}
