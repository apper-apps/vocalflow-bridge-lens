import React from "react";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const Loading = ({ variant = "dashboard" }) => {
  if (variant === "dashboard") {
    return (
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded shimmer mb-2" />
                  <div className="h-8 bg-gray-600 rounded shimmer w-20" />
                </div>
                <div className="w-12 h-12 bg-gray-600 rounded-lg shimmer" />
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* Activity Feed */}
            <Card>
              <div className="h-6 bg-gray-600 rounded shimmer mb-4 w-32" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-3 p-4 bg-surface/50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-600 rounded-full shimmer" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-600 rounded shimmer mb-2 w-24" />
                      <div className="h-16 bg-gray-600 rounded shimmer mb-2" />
                      <div className="flex space-x-4">
                        <div className="h-4 bg-gray-600 rounded shimmer w-16" />
                        <div className="h-4 bg-gray-600 rounded shimmer w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Sidebar Cards */}
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <div className="h-6 bg-gray-600 rounded shimmer mb-4 w-28" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-600 rounded shimmer" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-600 rounded shimmer mb-1" />
                        <div className="h-3 bg-gray-600 rounded shimmer w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-600 rounded-lg shimmer" />
              <div className="flex-1">
                <div className="h-5 bg-gray-600 rounded shimmer mb-2 w-3/4" />
                <div className="h-4 bg-gray-600 rounded shimmer mb-1 w-1/2" />
                <div className="h-3 bg-gray-600 rounded shimmer w-1/3" />
              </div>
              <div className="w-20 h-8 bg-gray-600 rounded shimmer" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-40 bg-gray-600 rounded-lg shimmer mb-4" />
            <div className="h-6 bg-gray-600 rounded shimmer mb-2" />
            <div className="h-4 bg-gray-600 rounded shimmer w-2/3 mb-3" />
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-600 rounded shimmer w-20" />
              <div className="h-8 w-20 bg-gray-600 rounded shimmer" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent" />
    </div>
  );
};

export default Loading;