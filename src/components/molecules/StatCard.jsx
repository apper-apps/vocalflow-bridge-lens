import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  variant = "default",
  className 
}) => {
  const variants = {
    default: "border-gray-700",
    primary: "border-primary/30 shadow-glow",
    success: "border-green-500/30",
    warning: "border-yellow-500/30"
  };

  const trendColors = {
    up: "text-green-400",
    down: "text-red-400",
    neutral: "text-gray-400"
  };

  return (
    <Card className={cn("border", variants[variant], className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold gradient-text">{value}</p>
          {trend && trendValue && (
            <div className="flex items-center mt-2 text-sm">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
                size={16} 
                className={cn("mr-1", trendColors[trend])} 
              />
              <span className={trendColors[trend]}>{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg">
            <ApperIcon name={icon} size={24} className="text-primary" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;