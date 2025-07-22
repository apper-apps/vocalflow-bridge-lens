import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Card from "@/components/atoms/Card";
import Progress from "@/components/atoms/Progress";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import exerciseService from "@/services/api/exerciseService";
import { cn } from "@/utils/cn";

function ExerciseRecommendations({ userLevel, userGoals }) {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completedExercises, setCompletedExercises] = useState(new Set());

const loadRecommendations = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await exerciseService.getRecommendations(userLevel, userGoals);
      setExercises(data);
    } catch (err) {
      console.error("Error loading recommendations:", err);
      setError("Failed to load exercise recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [userLevel, userGoals]);

  const handleStartExercise = (exerciseId) => {
    toast.info("Exercise player opening soon!");
  };

  const handleCompleteExercise = (exerciseId) => {
    setCompletedExercises(prev => new Set([...prev, exerciseId]));
    toast.success("Exercise completed! Great work! 🎵");
  };

  if (loading) {
    return <Loading variant="grid" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadRecommendations} />;
  }

if (exercises.length === 0) {
    return (
      <Empty
        title="No recommendations available"
        description="Update your profile goals to get personalized exercise recommendations"
        icon="Target"
        actionLabel="Update Profile"
        action={() => toast.info("Profile settings coming soon!")}
      />
    );
  }

  const completedCount = completedExercises.size;
  const totalCount = exercises.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card variant="glow">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold gradient-text">Today's Recommendations</h2>
              <p className="text-sm text-gray-400">AI-curated exercises for your goals</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold gradient-text">{completedCount}/{totalCount}</p>
              <p className="text-xs text-gray-400">completed</p>
            </div>
          </div>
          <Progress value={progressPercentage} variant="accent" />
        </div>
      </Card>

{/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.Id}
            exercise={exercise}
            isCompleted={completedExercises.has(exercise.Id)}
            onStart={() => handleStartExercise(exercise.Id)}
            onComplete={() => handleCompleteExercise(exercise.Id)}
          />
        ))}
      </div>
    </div>
  );
};

const ExerciseCard = ({ exercise, isCompleted, onStart, onComplete }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "success";
      case "Intermediate": return "warning";
      case "Advanced": return "danger";
      default: return "default";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Warm-ups": return "Sunrise";
      case "Agility": return "Zap";
      case "Breath Control": return "Wind";
      case "Range Extension": return "TrendingUp";
      case "Technique": return "Settings";
      default: return "Music";
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:scale-[1.02]",
      isCompleted && "border-green-500/30 shadow-green-500/20"
    )}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon 
                name={getCategoryIcon(exercise.category)} 
                size={20} 
                className="text-primary" 
              />
              <Badge variant={getDifficultyColor(exercise.difficulty)}>
                {exercise.difficulty}
              </Badge>
              <span className="text-sm text-gray-400">{exercise.duration} min</span>
            </div>
            <h3 className="font-display font-semibold text-white mb-1">
              {exercise.name}
            </h3>
            <p className="text-sm text-gray-300 mb-3 line-clamp-2">
              {exercise.instructions}
            </p>
          </div>
          {isCompleted && (
            <div className="flex-shrink-0 ml-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <ApperIcon name="Check" size={16} className="text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Target Areas */}
        <div className="flex flex-wrap gap-2">
          {exercise.targetAreas.slice(0, 3).map((area) => (
            <Badge key={area} variant="secondary" className="text-xs">
              {area}
            </Badge>
          ))}
          {exercise.targetAreas.length > 3 && (
            <Badge variant="default" className="text-xs">
              +{exercise.targetAreas.length - 3}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={onStart}
            className="flex-1"
            disabled={isCompleted}
          >
            <ApperIcon name="Play" size={16} className="mr-2" />
            {isCompleted ? "Completed" : "Start Exercise"}
          </Button>
          
          {!isCompleted && (
            <Button 
              variant="accent" 
              size="sm" 
              onClick={onComplete}
            >
              <ApperIcon name="Check" size={16} />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ExerciseRecommendations;