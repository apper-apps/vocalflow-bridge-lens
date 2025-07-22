import React from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  variant = "default"
}) => {
  if (variant === "inline") {
    return (
      <div className="flex items-center justify-center py-8 text-center">
        <div className="space-y-4">
          <ApperIcon name="AlertCircle" size={48} className="text-red-400 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Oops!</h3>
            <p className="text-gray-400 mb-4">{message}</p>
            {onRetry && (
              <Button onClick={onRetry} variant="accent" size="sm">
                <ApperIcon name="RefreshCw" size={16} className="mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card variant="minimal" className="text-center py-12">
      <div className="max-w-sm mx-auto space-y-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
          <ApperIcon name="AlertTriangle" size={40} className="text-red-400" />
        </div>
        
        <div>
          <h3 className="text-xl font-display font-semibold text-white mb-2">
            Something Went Wrong
          </h3>
          <p className="text-gray-400 leading-relaxed">{message}</p>
        </div>

        {onRetry && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onRetry} variant="primary">
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Try Again
            </Button>
            <Button variant="ghost" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 border-t border-gray-700 pt-4">
          If the problem persists, please contact support
        </div>
      </div>
    </Card>
  );
};

export default Error;