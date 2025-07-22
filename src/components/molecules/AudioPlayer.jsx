import React, { useState, useRef } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AudioPlayer = ({ src, className, onPlay, onPause }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef(null);
const togglePlayPause = () => {
    if (audioRef.current && !hasError && !isLoading) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        onPause?.();
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Audio play failed:', error);
          setHasError(true);
          setIsPlaying(false);
        });
        setIsPlaying(true);
        onPlay?.();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
      setHasError(false);
    }
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    setIsPlaying(false);
    console.error('Audio failed to load:', src);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={cn("bg-surface rounded-lg p-4 border border-gray-700", className)}>
<audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onError={handleError}
        onLoadStart={handleLoadStart}
        preload="metadata"
        className="hidden"
      />
      
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlayPause}
          className="flex-shrink-0"
        >
{isLoading ? (
            <ApperIcon
              name="Loader2"
              size={18}
              className="text-primary animate-spin"
            />
          ) : hasError ? (
            <ApperIcon
              name="AlertCircle"
              size={18}
              className="text-red-400"
            />
          ) : (
            <ApperIcon
              name={isPlaying ? "Pause" : "Play"}
              size={18}
              className="text-primary"
            />
          )}
        </Button>

        <div className="flex-1 flex items-center space-x-3">
          <span className="text-xs text-gray-400 min-w-[35px]">
            {formatTime(currentTime)}
          </span>
          
<div
            className={cn(
              "flex-1 h-2 bg-gray-700 rounded-full overflow-hidden transition-opacity",
              hasError || isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            )}
            onClick={!hasError && !isLoading ? handleSeek : undefined}
          >
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          
<span className="text-xs text-gray-400 min-w-[35px]">
            {hasError ? "--:--" : formatTime(duration)}
          </span>
        </div>

{/* Waveform visualization */}
        <div className="flex items-center space-x-1 ml-4">
          {hasError ? (
            <span className="text-xs text-red-400">Audio unavailable</span>
          ) : isLoading ? (
            <span className="text-xs text-gray-400">Loading...</span>
          ) : (
            [...Array(8)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1 rounded-full transition-all duration-300",
                  isPlaying ? "waveform-bar" : "bg-gray-600",
                  isPlaying && `h-${Math.floor(Math.random() * 4) + 2}`
                )}
                style={{
                  height: isPlaying ? `${Math.random() * 16 + 8}px` : "8px",
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;