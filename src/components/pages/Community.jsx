import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import CommunityFeed from "@/components/organisms/CommunityFeed";
import Practice from "@/components/pages/Practice";
import SearchBar from "@/components/molecules/SearchBar";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import userService from "@/services/api/userService";
const Community = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("feed");
  const [topSingers, setTopSingers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadTopSingers = async () => {
    try {
      setError("");
      setLoading(true);
      const users = await userService.getAll();
      // Sort by streak (mock leaderboard)
      const sorted = users.sort((a, b) => b.streak - a.streak);
      setTopSingers(sorted.slice(0, 5));
    } catch (err) {
      console.error("Error loading top singers:", err);
      setError("Failed to load community data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopSingers();
  }, []);

  const tabs = [
    { id: "feed", label: "Feed", icon: "Home" },
    { id: "discover", label: "Discover", icon: "Compass" },
    { id: "leaderboard", label: "Leaderboard", icon: "Trophy" }
  ];

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadTopSingers} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">
            VocalFlow Community
          </h1>
          <p className="text-gray-400">
            Connect, share, and learn with fellow vocalists around the world
          </p>
        </div>
        <Button variant="accent" size="lg">
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Share Recording
        </Button>
      </div>

      {/* Navigation Tabs */}
      <Card variant="compact">
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "primary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center space-x-2"
              >
                <ApperIcon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </Button>
            ))}
          </div>
          <SearchBar placeholder="Search singers, recordings..." className="w-64" />
        </div>
      </Card>

      {/* Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
<div className="xl:col-span-3">
          {activeTab === "feed" && <CommunityFeed />}
          {activeTab === "discover" && <DiscoverContent navigate={navigate} />}
          {activeTab === "leaderboard" && <LeaderboardContent topSingers={topSingers} navigate={navigate} />}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Stats */}
          <Card>
            <h3 className="text-lg font-display font-semibold gradient-text mb-4">
              Community Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Active Singers</span>
                <span className="font-semibold text-accent">2,847</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Recordings Shared</span>
                <span className="font-semibold text-primary">12,493</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Practice Minutes</span>
                <span className="font-semibold text-secondary">89,247</span>
              </div>
            </div>
          </Card>

          {/* Top Singers */}
          <Card>
            <h3 className="text-lg font-display font-semibold gradient-text mb-4">
              Top Singers This Week
            </h3>
            <div className="space-y-3">
              {topSingers.slice(0, 3).map((singer, index) => (
                <div key={singer.Id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? "bg-accent text-white" : 
                      index === 1 ? "bg-gray-400 text-gray-900" : 
                      "bg-orange-600 text-white"
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <ApperIcon name="User" size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{singer.name}</p>
                    <p className="text-xs text-gray-400">{singer.streak} day streak</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Trending Topics */}
          <Card>
            <h3 className="text-lg font-display font-semibold gradient-text mb-4">
              Trending Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Breath Control",
                "High Notes",
                "Jazz Vocals",
                "Classical Technique",
                "Pop Styling",
                "Range Extension"
              ].map((topic) => (
                <Badge key={topic} variant="secondary" className="cursor-pointer hover:bg-secondary/30">
                  #{topic.replace(" ", "")}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
const DiscoverContent = ({ navigate }) => {
  return (
    <div className="space-y-6">
<Card>
        <h2 className="text-xl font-display font-bold gradient-text mb-4">
          Discover New Singers
        </h2>
        <p className="text-gray-400 mb-6">
          Find singers who share your vocal style and interests
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Alex Rivera", type: "Tenor", level: "Advanced", specialty: "Musical Theater" },
            { name: "Maria Santos", type: "Soprano", level: "Professional", specialty: "Opera" },
            { name: "David Kim", type: "Bass", level: "Intermediate", specialty: "Pop/R&B" },
            { name: "Luna Zhang", type: "Alto", level: "Advanced", specialty: "Jazz" },
            { name: "Jordan Taylor", type: "Mezzo-Soprano", level: "Intermediate", specialty: "Folk/Indie" },
            { name: "Carlos Mendez", type: "Baritone", level: "Professional", specialty: "Classical" }
          ].map((singer, index) => (
            <Card key={index} variant="compact" className="hover:scale-[1.02] transition-transform cursor-pointer">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="User" size={24} className="text-white" />
                </div>
                <h4 className="font-semibold text-white mb-1">{singer.name}</h4>
<p className="text-sm text-gray-400 mb-2">{singer.type} • {singer.level}</p>
                <Badge variant="accent" className="text-xs mb-3">{singer.specialty}</Badge>
                <div className="flex space-x-2">
                  <Button variant="primary" size="sm" className="flex-1">
                    Follow
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate(`/messages/new/${index + 5}`)} // Mock user IDs
                    className="flex items-center justify-center"
                  >
                    <ApperIcon name="MessageCircle" size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};
const LeaderboardContent = ({ topSingers, navigate }) => {
  return (
    <div className="space-y-6">
<Card>
        <h2 className="text-xl font-display font-bold gradient-text mb-4">
          Practice Streak Leaderboard
        </h2>
        <p className="text-gray-400 mb-6">
          Celebrate consistent practice with our community leaders
        </p>
        
        <div className="space-y-4">
          {topSingers.map((singer, index) => (
            <div key={singer.Id} className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
              index < 3 ? "bg-gradient-to-r from-accent/10 to-orange-500/10 border border-accent/20" : "bg-surface/50"
            }`}>
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                index === 0 ? "bg-gradient-to-br from-accent to-orange-500 text-white text-lg" :
                index === 1 ? "bg-gray-300 text-gray-900" :
                index === 2 ? "bg-orange-600 text-white" :
                "bg-gray-600 text-gray-300"
              }`}>
                {index + 1}
              </div>
              
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <ApperIcon name="User" size={20} className="text-white" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-white">{singer.name}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="primary">{singer.voiceType}</Badge>
                  <Badge variant="secondary">{singer.level}</Badge>
                </div>
              </div>
<div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <ApperIcon name="Flame" size={20} className="text-accent practice-flame" />
                    <span className="text-2xl font-bold gradient-text">{singer.streak}</span>
                  </div>
                  <p className="text-sm text-gray-400">day streak</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(`/messages/new/${singer.Id}`)}
                  className="flex items-center justify-center"
                >
                  <ApperIcon name="MessageCircle" size={16} />
                </Button>
              </div>
</div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Community;