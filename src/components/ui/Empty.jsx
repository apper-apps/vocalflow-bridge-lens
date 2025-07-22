import React from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Nothing here yet",
  description = "Get started by adding your first item",
  icon = "Inbox",
  action,
  actionLabel = "Get Started",
  variant = "default"
}) => {
  if (variant === "inline") {
    return (
      <div className="flex items-center justify-center py-12 text-center">
        <div className="space-y-4 max-w-sm">
          <ApperIcon name={icon} size={48} className="text-gray-400 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400 mb-4">{description}</p>
            {action && (
              <Button onClick={action} variant="accent">
                {actionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card variant="minimal" className="text-center py-16">
      <div className="max-w-md mx-auto space-y-8">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
            <ApperIcon name={icon} size={48} className="text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <ApperIcon name="Plus" size={16} className="text-white" />
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-display font-bold gradient-text mb-3">
            {title}
          </h3>
          <p className="text-gray-400 leading-relaxed text-lg">{description}</p>
        </div>

        {action && (
          <div className="space-y-3">
            <Button onClick={action} variant="accent" size="lg" className="w-full sm:w-auto">
              <ApperIcon name="Plus" size={18} className="mr-2" />
              {actionLabel}
            </Button>
            <p className="text-sm text-gray-500">
              Start building your vocal practice journey today
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Empty;