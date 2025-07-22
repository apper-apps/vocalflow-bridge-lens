import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Community from "@/components/pages/Community";
import AudioPlayer from "@/components/molecules/AudioPlayer";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import submissionService from "@/services/api/submissionService";

const CommunityFeed = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSubmissions = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await submissionService.getAll();
      setSubmissions(data);
    } catch (err) {
      console.error("Error loading submissions:", err);
      setError("Failed to load community submissions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleLike = async (submissionId) => {
    try {
      await submissionService.toggleLike(submissionId, 1); // Current user ID
      await loadSubmissions(); // Reload to get updated likes
      toast.success("Liked!");
    } catch (err) {
      console.error("Error liking submission:", err);
      toast.error("Failed to like submission");
    }
  };

  const handleComment = async (submissionId, text) => {
    try {
      await submissionService.addComment(submissionId, 1, text); // Current user ID
      await loadSubmissions(); // Reload to get updated comments
      toast.success("Comment added!");
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment");
    }
  };

  if (loading) {
    return <Loading variant="list" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadSubmissions} />;
  }

  if (submissions.length === 0) {
    return (
      <Empty
        title="No submissions yet"
        description="Be the first to share your practice with the community!"
        icon="Mic"
        actionLabel="Upload Recording"
        action={() => toast.info("Recording upload coming soon!")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold gradient-text">Community Feed</h2>
        <Button variant="accent" size="sm">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Share Recording
        </Button>
      </div>

      <div className="space-y-4">
        {submissions.map((submission) => (
          <SubmissionCard
            key={submission.Id}
            submission={submission}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
      </div>
    </div>
  );
};

const SubmissionCard = ({ submission, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(submission.Id, newComment.trim());
      setNewComment("");
    }
  };

  return (
    <Card variant="compact">
      <div className="flex items-start space-x-4">
        {/* User Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
          {submission.userAvatar ? (
            <img 
              src={submission.userAvatar} 
              alt={submission.userName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <ApperIcon name="User" size={20} className="text-white" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-semibold text-white">{submission.userName}</h4>
            <span className="text-gray-400 text-sm">
              {format(new Date(submission.date), "MMM d, h:mm a")}
            </span>
          </div>

{/* Exercise Info */}
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="primary">{submission.exerciseType}</Badge>
            <Badge variant="secondary">{submission.goal}</Badge>
          </div>
        
          {submission.audioUrl && typeof submission.audioUrl === 'string' && submission.audioUrl.trim() && (
            <div className="mb-4">
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <ApperIcon name="Music" size={16} className="text-primary" />
                  <span className="text-sm text-gray-300">Audio Recording</span>
                </div>
                <AudioPlayer 
                  src={submission.audioUrl} 
                  onError={(e) => {
                    console.warn('Audio playback error for submission:', submission.id, e);
                  }}
                />
              </div>
            </div>
          )}
          
          {submission.audioUrl && (!submission.audioUrl.trim() || typeof submission.audioUrl !== 'string') && (
            <div className="mb-4">
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50 text-center">
                <ApperIcon name="AlertCircle" size={24} className="text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Audio unavailable</p>
              </div>
            </div>
          )}
          
          {submission.analysisData && (
            <div className="mb-4 p-3 bg-surface/50 rounded-lg">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Target" size={16} className="text-accent" />
                  <span className="text-gray-300">Score: </span>
                  <span className="font-semibold text-accent">
                    {submission.analysisData.overallScore}%
                  </span>
                </div>
                {submission.analysisData.pitchAccuracy && (
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Music" size={16} className="text-blue-400" />
                    <span className="text-gray-300">Pitch: </span>
                    <span className="font-semibold text-blue-400">
                      {submission.analysisData.pitchAccuracy}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Actions */}
          <div className="flex items-center space-x-4 py-2 border-t border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(submission.Id)}
              className="flex items-center space-x-2 hover:text-red-400 transition-colors"
            >
              <ApperIcon name="Heart" size={16} />
              <span>{submission.likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
            >
              <ApperIcon name="MessageCircle" size={16} />
              <span>{submission.comments.length}</span>
            </Button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 space-y-3">
              {/* Existing Comments */}
              {submission.comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3 p-3 bg-surface/30 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="User" size={14} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm text-white">{comment.userName}</span>
                      <span className="text-xs text-gray-400">
                        {format(new Date(comment.date), "MMM d, h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{comment.text}</p>
                  </div>
                </div>
              ))}

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-surface border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none"
                />
                <Button type="submit" variant="accent" size="sm" disabled={!newComment.trim()}>
                  <ApperIcon name="Send" size={16} />
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CommunityFeed;