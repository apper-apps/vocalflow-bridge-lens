import React, { useState, useRef } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AudioPlayer = ({ src, className, onPlay, onPause }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        onPause?.();
      } else {
        audioRef.current.play();
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
    }
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
        className="hidden"
      />
      
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlayPause}
          className="flex-shrink-0"
        >
          <ApperIcon
            name={isPlaying ? "Pause" : "Play"}
            size={18}
            className="text-primary"
          />
        </Button>

        <div className="flex-1 flex items-center space-x-3">
          <span className="text-xs text-gray-400 min-w-[35px]">
            {formatTime(currentTime)}
          </span>
          
          <div
            className="flex-1 h-2 bg-gray-700 rounded-full cursor-pointer overflow-hidden"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <span className="text-xs text-gray-400 min-w-[35px]">
            {formatTime(duration)}
          </span>
        </div>

        {/* Waveform visualization */}
        <div className="flex items-center space-x-1 ml-4">
          {[...Array(8)].map((_, i) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;