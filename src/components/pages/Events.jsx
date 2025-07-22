import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import eventService from "@/services/api/eventService";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { toast } from "react-toastify";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadEvents = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await eventService.getAll();
      setEvents(data);
      setFilteredEvents(data);
    } catch (err) {
      console.error("Error loading events:", err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, activeFilter, searchQuery]);

  const filterEvents = () => {
    let filtered = [...events];

    // Filter by time period
    const now = new Date();
    switch (activeFilter) {
      case "upcoming":
        filtered = filtered.filter(event => isAfter(new Date(event.datetime), now));
        break;
      case "thisWeek":
        const nextWeek = addDays(now, 7);
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.datetime);
          return isAfter(eventDate, now) && isBefore(eventDate, nextWeek);
        });
        break;
      case "past":
        filtered = filtered.filter(event => isBefore(new Date(event.datetime), now));
        break;
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  const handleRSVP = async (eventId) => {
    try {
      await eventService.rsvp(eventId, 1); // Current user ID
      await loadEvents(); // Reload to get updated RSVP status
      toast.success("RSVP updated!");
    } catch (err) {
      console.error("Error updating RSVP:", err);
      toast.error("Failed to update RSVP");
    }
  };

  const filters = [
    { id: "all", label: "All Events", icon: "Calendar" },
    { id: "upcoming", label: "Upcoming", icon: "Clock" },
    { id: "thisWeek", label: "This Week", icon: "CalendarDays" },
    { id: "past", label: "Past", icon: "History" }
  ];

  if (loading) {
    return <Loading variant="list" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadEvents} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">
            Live Events & Classes
          </h1>
          <p className="text-gray-400">
            Join live vocal coaching sessions and masterclasses with expert instructors
          </p>
        </div>
        <Button variant="accent" size="lg">
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Host Event
        </Button>
      </div>

      {/* Filters and Search */}
      <Card variant="compact">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "primary" : "ghost"}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                className="flex items-center space-x-2"
              >
                <ApperIcon name={filter.icon} size={16} />
                <span>{filter.label}</span>
              </Button>
            ))}
          </div>
          <SearchBar
            placeholder="Search events, instructors..."
            onSearch={setSearchQuery}
            className="w-full lg:w-64"
          />
        </div>
      </Card>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <Empty
          title="No events found"
          description={
            activeFilter === "all"
              ? "No events are currently scheduled"
              : `No events match your current filter: ${filters.find(f => f.id === activeFilter)?.label}`
          }
          icon="Calendar"
          actionLabel="View All Events"
          action={() => setActiveFilter("all")}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.Id}
              event={event}
              onRSVP={handleRSVP}
              currentUserId={1} // Current user ID
            />
          ))}
        </div>
      )}
    </div>
  );
};

const EventCard = ({ event, onRSVP, currentUserId }) => {
  const isUpcoming = isAfter(new Date(event.datetime), new Date());
  const isUserRSVPd = event.rsvpList.includes(currentUserId);
  const spotsRemaining = event.maxParticipants - event.rsvpList.length;

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner": return "success";
      case "Intermediate": return "warning";
      case "Advanced": return "danger";
      default: return "default";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Technique": return "Settings";
      case "Style": return "Music";
      case "Classical": return "Crown";
      case "Contemporary": return "Mic";
      case "Health": return "Heart";
      default: return "Calendar";
    }
  };

  return (
    <Card className="hover:scale-[1.01] transition-transform">
      <div className="space-y-4">
        {/* Event Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon
                name={getCategoryIcon(event.category)}
                size={20}
                className="text-primary"
              />
              <Badge variant={getLevelColor(event.level)}>
                {event.level}
              </Badge>
              <Badge variant="secondary">{event.category}</Badge>
            </div>
            <h3 className="font-display font-semibold text-white text-lg mb-1">
              {event.title}
            </h3>
            <p className="text-sm text-gray-400 mb-2">
              with {event.instructorName}
            </p>
          </div>
          {isUserRSVPd && (
            <Badge variant="accent" className="flex-shrink-0">
              <ApperIcon name="Check" size={12} className="mr-1" />
              RSVP'd
            </Badge>
          )}
        </div>

        {/* Event Description */}
        <p className="text-sm text-gray-300 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-3">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Calendar" size={16} className="text-accent" />
              <span className="text-white">
                {format(new Date(event.datetime), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Clock" size={16} className="text-accent" />
              <span className="text-white">
                {format(new Date(event.datetime), "h:mm a")}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Timer" size={16} className="text-accent" />
              <span className="text-white">{event.duration} min</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <ApperIcon name="Users" size={16} className="text-gray-400" />
              <span className="text-gray-300">
                {event.rsvpList.length}/{event.maxParticipants} spots filled
              </span>
            </div>
            {spotsRemaining <= 5 && spotsRemaining > 0 && (
              <Badge variant="warning" className="text-xs">
                {spotsRemaining} spots left
              </Badge>
            )}
            {spotsRemaining === 0 && (
              <Badge variant="danger" className="text-xs">
                Full
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-3 border-t border-gray-700">
          <Button
            variant={isUserRSVPd ? "secondary" : "primary"}
            className="flex-1"
            onClick={() => onRSVP(event.Id)}
            disabled={!isUpcoming || (spotsRemaining === 0 && !isUserRSVPd)}
          >
            <ApperIcon
              name={isUserRSVPd ? "UserMinus" : "UserPlus"}
              size={16}
              className="mr-2"
            />
            {isUserRSVPd ? "Cancel RSVP" : spotsRemaining === 0 ? "Full" : "RSVP"}
          </Button>

          {isUpcoming && event.streamUrl && (
            <Button variant="accent" size="sm">
              <ApperIcon name="ExternalLink" size={16} className="mr-2" />
              Join
            </Button>
          )}

          {!isUpcoming && (
            <Button variant="ghost" size="sm">
              <ApperIcon name="Play" size={16} className="mr-2" />
              Recording
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Events;