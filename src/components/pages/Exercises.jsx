import React from "react";
import ExerciseRecommendations from "@/components/organisms/ExerciseRecommendations";

const Exercises = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold gradient-text mb-2">
          AI Exercise Recommendations
        </h1>
        <p className="text-gray-400">
          Personalized vocal exercises designed to help you reach your goals
        </p>
      </div>

      {/* Exercise Recommendations */}
      <ExerciseRecommendations 
        userLevel="Intermediate" 
        userGoals={["Pitch Accuracy", "Breath Control", "Range Extension"]} 
      />
    </div>
  );
};

export default Exercises;