import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PracticeStreak = ({ streak = 0, className }) => {
  const getFlameSize = () => {
    if (streak >= 30) return 32;
    if (streak >= 14) return 28;
    if (streak >= 7) return 24;
    return 20;
  };

  const getFlameIntensity = () => {
    if (streak >= 30) return "practice-flame animate-flame";
    if (streak >= 14) return "text-accent";
    if (streak >= 7) return "text-orange-400";
    return "text-gray-500";
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <ApperIcon
        name="Flame"
        size={getFlameSize()}
        className={getFlameIntensity()}
      />
      <div>
        <p className="text-2xl font-bold gradient-text">{streak}</p>
        <p className="text-xs text-gray-400">day streak</p>
      </div>
    </div>
  );
};

export default PracticeStreak;