import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import PracticeStreak from "@/components/molecules/PracticeStreak";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import CommunityFeed from "@/components/organisms/CommunityFeed";
import ExerciseRecommendations from "@/components/organisms/ExerciseRecommendations";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import practiceService from "@/services/api/practiceService";
import eventService from "@/services/api/eventService";
import userService from "@/services/api/userService";
import { format } from "date-fns";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [userStats, events, currentUser] = await Promise.all([
        practiceService.getUserStats(1), // Current user ID
        eventService.getUpcoming(),
        userService.getCurrentUser()
      ]);
      
      setStats(userStats);
      setUpcomingEvents(events.slice(0, 3));
      setUser(currentUser);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">
            Welcome back, {user?.name || "Singer"}! 🎵
          </h1>
          <p className="text-gray-400">
            Ready to continue your vocal journey? Let's make today count!
          </p>
        </div>
        <Button variant="accent" size="lg">
          <ApperIcon name="Mic" size={20} className="mr-2" />
          Start Practice
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current Streak"
          value={`${stats?.currentStreak || 0} days`}
          icon="Flame"
          trend="up"
          trendValue="+2 from last week"
          variant="primary"
        />
        <StatCard
          title="Total Practice Time"
          value={`${stats?.totalMinutes || 0}m`}
          icon="Clock"
          trend="up"
          trendValue="+45m this week"
        />
        <StatCard
          title="Sessions This Week"
          value={stats?.sessionsThisWeek || 0}
          icon="Calendar"
          trend="up"
          trendValue="On track!"
        />
        <StatCard
          title="Average Voice Health"
          value={`${stats?.averageVoiceHealth || 0}/5`}
          icon="Heart"
          trend="up"
          trendValue="Excellent"
          variant="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="xl:col-span-2 space-y-8">
          {/* Today's Progress */}
          <Card variant="glow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold gradient-text">Today's Progress</h2>
              <PracticeStreak streak={stats?.currentStreak || 0} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-surface/50 rounded-lg">
                <ApperIcon name="Target" size={32} className="text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">3/4</p>
                <p className="text-sm text-gray-400">Exercises Complete</p>
              </div>
              <div className="text-center p-4 bg-surface/50 rounded-lg">
                <ApperIcon name="Clock" size={32} className="text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">25m</p>
                <p className="text-sm text-gray-400">Practice Time</p>
              </div>
              <div className="text-center p-4 bg-surface/50 rounded-lg">
                <ApperIcon name="TrendingUp" size={32} className="text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">92%</p>
                <p className="text-sm text-gray-400">Avg. Accuracy</p>
              </div>
            </div>
          </Card>

          {/* Community Feed */}
          <CommunityFeed />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-display font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="primary" className="w-full justify-start">
                <ApperIcon name="Mic" size={18} className="mr-3" />
                Record Practice Session
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <ApperIcon name="Calendar" size={18} className="mr-3" />
                View Practice Calendar
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <ApperIcon name="Users" size={18} className="mr-3" />
                Browse Community
              </Button>
            </div>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-semibold text-white">Upcoming Events</h3>
              <Button variant="ghost" size="sm">
                <ApperIcon name="ExternalLink" size={16} />
              </Button>
            </div>
            
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.Id} className="p-3 bg-surface/50 rounded-lg">
                    <h4 className="font-medium text-white text-sm mb-1">{event.title}</h4>
                    <p className="text-xs text-gray-400 mb-2">{event.instructorName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-accent">
                        {format(new Date(event.datetime), "MMM d, h:mm a")}
                      </span>
                      <Button variant="ghost" size="sm" className="text-xs px-2 py-1">
                        RSVP
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                No upcoming events
              </p>
            )}
          </Card>

          {/* Achievement Badge */}
          <Card className="bg-gradient-to-br from-accent/10 to-orange-500/10 border-accent/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Award" size={32} className="text-white" />
              </div>
              <h3 className="font-display font-semibold text-white mb-1">Week Warrior!</h3>
              <p className="text-sm text-gray-400 mb-3">
                Practiced 5 days this week
              </p>
              <Button variant="accent" size="sm">
                View Achievements
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;