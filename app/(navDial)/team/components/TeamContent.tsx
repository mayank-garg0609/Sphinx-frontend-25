import { TeamSection } from "../types/teamTypes";
import TeamsCard from "@/app/components/teamCard";
import { Advisors } from "../data/team";
import CoreTeam from "./CoreTeam";

interface TeamContentProps {
  view: TeamSection;
}

export default function TeamContent({ view }: TeamContentProps) {
  return (
    <div className="relative z-10 text-white px-6 sm:px-10 flex flex-col items-center justify-center mt-32 lg:mt-44"> {/* Updated mt-20 lg:mt-32 */}
      <h1 className="text-4xl font-bold mb-6 text-center">Meet the Team</h1>
      {view === "core" && <CoreTeam />}
      {view === "advisors" && (
        <div className="flex flex-col gap-8 justify-center pt-8">
          {Advisors.map((card) => (
            <TeamsCard key={card.id} {...card} />
          ))}
        </div>
      )}
    </div>
  );
}