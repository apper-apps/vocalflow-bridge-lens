import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import PracticeCalendar from "@/components/organisms/PracticeCalendar";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import practiceService from "@/services/api/practiceService";
import { toast } from "react-toastify";

const Practice = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionData, setSessionData] = useState({
    duration: "",
    voiceHealth: 5,
    exercises: [],
    notes: ""
  });

  const loadPracticeStats = async () => {
    try {
      setError("");
      setLoading(true);
      const userStats = await practiceService.getUserStats(1); // Current user ID
      setStats(userStats);
    } catch (err) {
      console.error("Error loading practice stats:", err);
      setError("Failed to load practice statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPracticeStats();
  }, []);

  const handleLogSession = async (e) => {
    e.preventDefault();
    
    if (!sessionData.duration || sessionData.duration <= 0) {
      toast.error("Please enter a valid practice duration");
      return;
    }

    try {
      await practiceService.create({
        userId: 1,
        duration: parseInt(sessionData.duration),
        voiceHealth: sessionData.voiceHealth,
        exercises: sessionData.exercises,
        notes: sessionData.notes
      });
      
      toast.success("Practice session logged! 🎵");
      setShowSessionModal(false);
      setSessionData({
        duration: "",
        voiceHealth: 5,
        exercises: [],
        notes: ""
      });
      
      // Reload stats
      loadPracticeStats();
    } catch (err) {
      console.error("Error logging session:", err);
      toast.error("Failed to log practice session");
    }
  };

  const handleVoiceHealthChange = (health) => {
    setSessionData(prev => ({ ...prev, voiceHealth: health }));
  };

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadPracticeStats} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">
            Practice Tracker
          </h1>
          <p className="text-gray-400">
            Track your vocal practice journey and build consistent habits
          </p>
        </div>
        <Button 
          variant="accent" 
          size="lg"
          onClick={() => setShowSessionModal(true)}
        >
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Log Practice
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current Streak"
          value={`${stats?.currentStreak || 0} days`}
          icon="Flame"
          variant="primary"
        />
        <StatCard
          title="Total Sessions"
          value={stats?.totalSessions || 0}
          icon="Calendar"
        />
        <StatCard
          title="Total Practice Time"
          value={`${Math.floor((stats?.totalMinutes || 0) / 60)}h ${(stats?.totalMinutes || 0) % 60}m`}
          icon="Clock"
        />
        <StatCard
          title="Average Session"
          value={`${stats?.averageDuration || 0} min`}
          icon="BarChart3"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="xl:col-span-2">
          <PracticeCalendar userId={1} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Status */}
          <Card variant="glow">
            <h3 className="text-lg font-display font-semibold gradient-text mb-4">
              Today's Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-surface/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Target" size={20} className="text-accent" />
                  <span className="text-white">Practice Goal</span>
                </div>
                <span className="text-accent font-semibold">30 min</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-surface/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="CheckCircle2" size={20} className="text-green-400" />
                  <span className="text-white">Completed</span>
                </div>
                <span className="text-green-400 font-semibold">25 min</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-surface/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Heart" size={20} className="text-red-400" />
                  <span className="text-white">Voice Health</span>
                </div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <ApperIcon
                      key={i}
                      name="Heart"
                      size={12}
                      className={i < 4 ? "text-red-400 fill-current" : "text-gray-600"}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Weekly Progress */}
          <Card>
            <h3 className="text-lg font-display font-semibold text-white mb-4">
              This Week's Progress
            </h3>
            <div className="space-y-3">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                const practiced = index < 5; // Mock data
                const isToday = index === 4;
                
                return (
                  <div key={day} className="flex items-center justify-between">
                    <span className={`text-sm ${isToday ? "font-semibold text-white" : "text-gray-400"}`}>
                      {day}
                    </span>
                    <div className="flex items-center space-x-2">
                      {practiced ? (
                        <>
                          <ApperIcon name="Flame" size={16} className="text-accent practice-flame" />
                          <span className="text-sm text-accent">35m</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">Rest</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Voice Health Tips */}
          <Card>
            <h3 className="text-lg font-display font-semibold text-white mb-4">
              Voice Health Tips
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <ApperIcon name="Droplets" size={16} className="text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">Stay Hydrated</span>
                </div>
                <p className="text-xs text-gray-400">
                  Drink room temperature water throughout the day
                </p>
              </div>
              
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <ApperIcon name="Wind" size={16} className="text-green-400" />
                  <span className="text-sm font-medium text-green-400">Warm Up</span>
                </div>
                <p className="text-xs text-gray-400">
                  Always start with gentle vocal warm-ups
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Practice Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <form onSubmit={handleLogSession} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-semibold gradient-text">
                  Log Practice Session
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSessionModal(false)}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <Input
                label="Duration (minutes)"
                type="number"
                value={sessionData.duration}
                onChange={(e) => setSessionData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="30"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  How does your voice feel today?
                </label>
                <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleVoiceHealthChange(rating)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                        sessionData.voiceHealth >= rating
                          ? "bg-red-500 text-white"
                          : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      }`}
                    >
                      <ApperIcon name="Heart" size={16} />
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Session Notes (Optional)
                </label>
                <textarea
                  value={sessionData.notes}
                  onChange={(e) => setSessionData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="How did your practice go today?"
                  rows={3}
                  className="w-full bg-surface border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowSessionModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="accent" className="flex-1">
                  <ApperIcon name="Check" size={16} className="mr-2" />
                  Log Session
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Practice;