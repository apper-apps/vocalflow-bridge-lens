import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Exercises from "@/components/pages/Exercises";
import AudioPlayer from "@/components/molecules/AudioPlayer";
import Card from "@/components/atoms/Card";
import Progress from "@/components/atoms/Progress";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import exerciseService from "@/services/api/exerciseService";
import { cn } from "@/utils/cn";

function ExerciseRecommendations({ userLevel, userGoals }) {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [dailyNeeds, setDailyNeeds] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
const loadRecommendations = async (needsInput = "") => {
    try {
      setError("");
      setLoading(true);
      const data = await exerciseService.getAiRecommendations(userLevel, userGoals, needsInput);
      setExercises(data);
      if (needsInput) {
        toast.success("AI curated exercises for your needs!");
      }
    } catch (err) {
      console.error("Error loading recommendations:", err);
      setError("Failed to load exercise recommendations");
    } finally {
      setLoading(false);
      setIsAiLoading(false);
    }
  };

  const handleAiRecommendations = async () => {
    if (!dailyNeeds.trim()) {
      toast.warning("Please describe what you need to work on today");
      return;
    }
    
    setIsAiLoading(true);
    await loadRecommendations(dailyNeeds.trim());
  };

  useEffect(() => {
    loadRecommendations();
  }, [userLevel, userGoals]);
const handleStartExercise = (exerciseId) => {
    const exercise = exercises.find(ex => ex.Id === exerciseId);
    if (exercise) {
      setSelectedExercise(exercise);
    }
  };

  const handleCompleteExercise = (exerciseId) => {
    setCompletedExercises(prev => new Set([...prev, exerciseId]));
    toast.success("Exercise completed! Great work! 🎵");
  };

  const handleCloseExercise = () => {
    setSelectedExercise(null);
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
      {/* AI Input Section */}
      <Card variant="glow">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Brain" size={20} className="text-primary" />
            <h2 className="text-xl font-display font-bold gradient-text">AI Exercise Curator</h2>
          </div>
          <p className="text-sm text-gray-400">Tell the AI what you need to work on today for personalized recommendations</p>
          <div className="flex space-x-3">
            <Input
              placeholder="e.g., I need to work on breath control and high notes..."
              value={dailyNeeds}
              onChange={(e) => setDailyNeeds(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAiRecommendations()}
            />
            <Button 
              onClick={handleAiRecommendations}
              disabled={isAiLoading || !dailyNeeds.trim()}
              variant="primary"
            >
              {isAiLoading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  AI Thinking...
                </>
              ) : (
                <>
                  <ApperIcon name="Sparkles" size={16} className="mr-2" />
                  Curate
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

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

      {/* Exercise Player Modal */}
      {selectedExercise && (
        <ExercisePlayer
          exercise={selectedExercise}
          onClose={handleCloseExercise}
          onComplete={() => handleCompleteExercise(selectedExercise.Id)}
        />
      )}
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

const ExercisePlayer = ({ exercise, onClose, onComplete }) => {
  const [currentSyllable, setCurrentSyllable] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGraph, setShowGraph] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleComplete = () => {
    setHasCompleted(true);
    onComplete();
    toast.success("Exercise completed! Great work! 🎵");
  };

  const handleNext = () => {
    if (currentSyllable < exercise.syllables.length - 1) {
      setCurrentSyllable(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSyllable > 0) {
      setCurrentSyllable(prev => prev - 1);
    }
  };

  // Generate visual pattern for the graph
  const generatePattern = () => {
    const pattern = exercise.visualPattern || [];
    return pattern.length > 0 ? pattern : Array.from({ length: 20 }, (_, i) => 
      Math.sin(i * 0.5) * 30 + 50 + Math.random() * 10
    );
  };

  const pattern = generatePattern();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold gradient-text">{exercise.name}</h2>
              <p className="text-sm text-gray-400">{exercise.category} • {exercise.difficulty} • {exercise.duration} min</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          {/* Instructions */}
          <Card className="bg-surface/50">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <ApperIcon name="BookOpen" size={18} className="text-accent" />
                <h3 className="font-semibold">Instructions</h3>
              </div>
              <p className="text-gray-300">{exercise.instructions}</p>
              <div className="flex flex-wrap gap-2">
                {exercise.targetAreas.map((area) => (
                  <Badge key={area} variant="accent" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Visual Graph and Syllables */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Exercise Graph */}
            <Card className="bg-surface/50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Exercise Pattern</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowGraph(!showGraph)}
                  >
                    <ApperIcon name={showGraph ? "EyeOff" : "Eye"} size={16} />
                  </Button>
                </div>
                
                {showGraph && (
                  <div className="relative h-40 bg-gray-900 rounded-lg overflow-hidden">
                    <svg width="100%" height="100%" className="absolute inset-0">
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6B46C1" />
                          <stop offset="50%" stopColor="#EC4899" />
                          <stop offset="100%" stopColor="#F59E0B" />
                        </linearGradient>
                      </defs>
                      <polyline
                        points={pattern.map((value, index) => 
                          `${(index / (pattern.length - 1)) * 100}%,${100 - (value / 100) * 100}%`
                        ).join(' ')}
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        className="animate-pulse"
                      />
                    </svg>
                    
                    {/* Current position indicator */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-white/60 transition-all duration-500"
                      style={{ 
                        left: `${(currentSyllable / (exercise.syllables.length - 1)) * 100}%` 
                      }}
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Syllables/Vowels */}
            <Card className="bg-surface/50">
              <div className="space-y-4">
                <h3 className="font-semibold">Syllables & Vowels</h3>
                
                <div className="text-center space-y-4">
                  <div className="text-6xl font-display font-bold gradient-text">
                    {exercise.syllables[currentSyllable] || "Ma"}
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    Syllable {currentSyllable + 1} of {exercise.syllables.length}
                  </div>
                  
                  <div className="flex justify-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={currentSyllable === 0}
                    >
                      <ApperIcon name="ChevronLeft" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNext}
                      disabled={currentSyllable === exercise.syllables.length - 1}
                    >
                      <ApperIcon name="ChevronRight" size={16} />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {exercise.syllables.map((syllable, index) => (
                    <Button
                      key={index}
                      variant={index === currentSyllable ? "primary" : "ghost"}
                      size="sm"
                      className="text-xs"
                      onClick={() => setCurrentSyllable(index)}
                    >
                      {syllable}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Audio Player with Recording */}
          <Card className="bg-surface/50">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Headphones" size={18} className="text-secondary" />
                <h3 className="font-semibold">Audio Track & Recording</h3>
              </div>
              
              <AudioPlayer
                src={exercise.audioExample}
                className="mb-4"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                enableRecording={true}
              />
            </div>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={onClose}>
                <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                Back to Exercises
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="accent"
                onClick={handleComplete}
                disabled={hasCompleted}
              >
                <ApperIcon name="Check" size={16} className="mr-2" />
                {hasCompleted ? "Completed!" : "Mark Complete"}
              </Button>
            </div>
          </div>
        </div>
</Card>
  </div>
);
};

export default ExerciseRecommendations;