import React from "react";
import { SkillsSectionProps } from "../types/aboutUs";
import SkillBar from "./SkillBar";
import StatItem from "./StatItem";

const SkillsSection: React.FC<SkillsSectionProps> = React.memo(({ 
  skills, 
  stats 
}) => {
  return (
    <section className="px-6 py-24 bg-gradient-to-b from-transparent via-zinc-900/50 to-transparent">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
        <div>
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
            SPHINX Highlights
          </h2>
          <p className="text-zinc-400 mb-16 text-lg leading-relaxed">
            From electrifying stage events and artistic showcases to immersive
            cultural experiences and competitions, SPHINX is where passion
            meets performance.
          </p>
          <div>
            {skills.map((skill, index) => (
              <SkillBar
                key={skill.skill}
                skill={skill.skill}
                percentage={skill.percentage}
                delay={300 + index * 200}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              delay={900 + index * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

SkillsSection.displayName = "SkillsSection";

export default SkillsSection;