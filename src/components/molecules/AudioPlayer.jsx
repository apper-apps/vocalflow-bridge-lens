import React, { useRef, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const AudioPlayer = ({ src, className, onPlay, onPause, onError, enableRecording = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [playingRecorded, setPlayingRecorded] = useState(false);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedAudioRef = useRef(null);
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
          onError?.(error);
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

const handleError = (error) => {
    setHasError(true);
    setIsLoading(false);
    setIsPlaying(false);
    const errorMessage = `Audio failed to load: ${src}`;
    console.error(errorMessage, error);
    onError?.(errorMessage);
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
} catch (error) {
      console.error('Recording failed:', error);
      alert('Recording failed. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (recordedBlob && recordedAudioRef.current) {
      if (playingRecorded) {
        recordedAudioRef.current.pause();
        setPlayingRecorded(false);
      } else {
        const url = URL.createObjectURL(recordedBlob);
        recordedAudioRef.current.src = url;
        recordedAudioRef.current.play();
        setPlayingRecorded(true);
      }
    }
  };
return (
    <div className={cn("bg-surface rounded-lg p-4 border border-gray-700 space-y-4", className)}>
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
      
      {recordedBlob && (
        <audio
          ref={recordedAudioRef}
          onEnded={() => setPlayingRecorded(false)}
          className="hidden"
        />
      )}
      
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

      {/* Recording Controls */}
      {enableRecording && (
        <div className="border-t border-gray-700 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant={isRecording ? "danger" : "accent"}
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isRecording && !mediaRecorderRef.current}
              >
                <ApperIcon 
                  name={isRecording ? "Square" : "Mic"} 
                  size={16} 
                  className="mr-2"
                />
                {isRecording ? "Stop Recording" : "Record"}
              </Button>

              {recordedBlob && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={playRecording}
                >
                  <ApperIcon 
                    name={playingRecorded ? "Pause" : "Play"} 
                    size={16} 
                    className="mr-2"
                  />
                  {playingRecorded ? "Pause" : "Play Recording"}
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {isRecording && (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-400">Recording...</span>
                </>
              )}
              {recordedBlob && !isRecording && (
                <span className="text-sm text-green-400">✓ Recording ready</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;