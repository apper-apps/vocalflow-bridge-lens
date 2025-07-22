import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import practiceService from "@/services/api/practiceService";
import { cn } from "@/utils/cn";

const PracticeCalendar = ({ userId = 1 }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCalendarData = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await practiceService.getCalendarData(
        userId,
        currentDate.getFullYear(),
        currentDate.getMonth()
      );
      setCalendarData(data);
    } catch (err) {
      console.error("Error loading calendar data:", err);
      setError("Failed to load practice calendar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendarData();
  }, [currentDate, userId]);

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-600 rounded w-48 mx-auto" />
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-600 rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadCalendarData} variant="inline" />;
  }

  const days = getDaysInMonth();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card>
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
            <ApperIcon name="ChevronLeft" size={20} />
          </Button>
          
          <h3 className="text-lg font-display font-semibold text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          
          <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
            <ApperIcon name="ChevronRight" size={20} />
          </Button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <CalendarDay
              key={index}
              day={day}
              practiceData={day ? calendarData[day] : null}
              isToday={day && isToday(currentDate.getFullYear(), currentDate.getMonth(), day)}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-400 border-t border-gray-700 pt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-accent rounded-full practice-flame" />
            <span>Practice Day</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-600 rounded-full" />
            <span>Rest Day</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const CalendarDay = ({ day, practiceData, isToday }) => {
  if (!day) {
    return <div className="h-10" />; // Empty cell
  }

  const hasPracticed = practiceData?.practiced || false;

  return (
    <div
      className={cn(
        "h-10 w-full flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 relative",
        isToday && "ring-2 ring-primary/50",
        hasPracticed 
          ? "bg-gradient-to-br from-accent/20 to-orange-500/20 text-accent border border-accent/30 hover:bg-accent/10" 
          : "bg-gray-800 text-gray-400 hover:bg-gray-700",
        "cursor-pointer"
      )}
    >
      <span>{day}</span>
      {hasPracticed && (
        <div className="absolute -top-1 -right-1">
          <ApperIcon name="Flame" size={12} className="text-accent practice-flame" />
        </div>
      )}
      {practiceData?.duration && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="w-1 h-1 bg-accent rounded-full" />
        </div>
      )}
    </div>
  );
};

const isToday = (year, month, day) => {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day
  );
};

export default PracticeCalendar;