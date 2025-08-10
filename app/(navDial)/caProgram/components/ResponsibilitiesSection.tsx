import { responsibilities } from "../utils/responsibilities";
import { memo } from "react";
import type { IconProps } from "../tupes/caProgram";
import { iconPaths } from "../utils/icons";

const Icon = memo<IconProps>(function Icon({
  name,
  className = "text-purple-300",
  size = 18,
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={`${name} icon`}
    >
      <path d={iconPaths[name]} />
    </svg>
  );
});
const ResponsibilitiesSection = memo(function ResponsibilitiesSection() {
  return (
    <section className="mb-6 sm:mb-8">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-yellow-300 drop-shadow-lg">
        Your Role & Responsibilities
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
        {responsibilities.map((responsibility) => (
          <div
            key={responsibility.id}
            className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-black/40 backdrop-blur-md shadow-lg hover:bg-black/50 transition-all duration-200"
          >
            <Icon
              name="clipboard"
              className="text-yellow-300 mt-1 flex-shrink-0"
              size={18}
            />
            <span className="text-sm lg:text-base text-gray-100">
              {responsibility.description}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
});

export default ResponsibilitiesSection;
