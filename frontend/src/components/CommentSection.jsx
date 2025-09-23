import { useState, useEffect } from "react";
import axios from "axios";
import { MessageCircle, Reply, ThumbsUp, Send, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const CommentSection = ({ blogId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch comments
  // useEffect(() => {
  //   if (!blogId) return;

  //   fetchComments();
  // }, [blogId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/comments/${blogId}`,
        { withCredentials: true }
      );
      setComments(Array.isArray(data) ? data : data.comments || []);
    } catch (error) {
      toast.error("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blogId) fetchComments();
  }, [blogId]);

  // Add new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/api/comments/${blogId}`,
        {
          content: newComment,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Your comment has been posted successfully.");
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to post comment");
    }
  };

  // Add reply
  const handleAddReply = async (parentId) => {
    if (!replyContent.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/api/comments/${blogId}`,
        {
          content: replyContent,
          parentComment: parentId,
        },
        { withCredentials: true }
      );
      toast.success("Your reply has been posted successfully.");
      setReplyContent("");
      setReplyingTo(null);
      fetchComments();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to post reply");
    }
  };

  // Local like toggle (not connected to backend yet)
  const handleLike = (commentId, isReply = false, parentId) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (isReply && comment._id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply._id === commentId
                ? {
                    ...reply,
                    likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
                    liked: !reply.liked,
                  }
                : reply
            ),
          };
        } else if (!isReply && comment._id === commentId) {
          return {
            ...comment,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
            liked: !comment.liked,
          };
        }
        return comment;
      })
    );
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <h3 className="text-lg font-semibold">
              Discussion (
              {Array.isArray(comments)
                ? comments.length +
                  comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)
                : 0}
              )
            </h3>
          </div>
        </CardHeader>
        <CardContent>
          {/* Add Comment Form */}
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={currentUser?.avatar || "/api/placeholder/40/40"}
                  alt={currentUser?.fullname || "User"}
                />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Share your thoughts about this article..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] mb-3"
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Be respectful and constructive in your comments
                  </p>
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          {loading ? (
            <p className="text-center text-muted-foreground">
              Loading comments...
            </p>
          ) : comments.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            <div className="space-y-6">
              {Array.isArray(comments) && comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="border-b border-border/50 pb-6 last:border-b-0"
                  >
                    {/* Main Comment */}
                    <div className="flex items-start gap-3 mb-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={comment.authorAvatar || "/api/placeholder/40/40"}
                          alt={comment.authorName || "User"}
                        />
                        <AvatarFallback>
                          {comment.authorName?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">
                            {comment.authorName || "Anonymous"}
                          </span>
                          {comment.user?.verified && (
                            <Badge variant="secondary" className="text-xs">
                              ✓ Verified
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {formatTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-foreground mb-3 leading-relaxed">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(comment._id)}
                            className={`text-muted-foreground hover:text-foreground ${
                              comment.liked ? "text-primary" : ""
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {comment.likes || 0}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setReplyingTo(
                                replyingTo === comment._id ? null : comment._id
                              )
                            }
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Reply className="w-4 h-4 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment._id && (
                      <div className="ml-13 mb-4">
                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={
                                currentUser?.avatar || "/api/placeholder/40/40"
                              }
                              alt={currentUser?.fullname || "User"}
                            />
                            <AvatarFallback>
                              <User className="w-3 h-3" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <Textarea
                              placeholder={`Reply to ${
                                comment.authorName || "user"
                              }...`}
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              className="min-h-[80px] mb-2"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAddReply(comment._id)}
                                disabled={!replyContent.trim()}
                              >
                                <Send className="w-3 h-3 mr-1" />
                                Reply
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyContent("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies?.length > 0 && (
                      <div className="ml-13 space-y-4">
                        {comment.replies.map((reply) => (
                          <div
                            key={reply._id}
                            className="flex items-start gap-3"
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={
                                  reply.authorAvatar || "/api/placeholder/40/40"
                                }
                                alt={reply.authorName || "User"}
                              />
                              <AvatarFallback>
                                {reply.authorName?.[0] || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">
                                  {reply.authorName || "Anonymous"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-foreground mb-2 leading-relaxed">
                                {reply.content}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleLike(reply._id, true, comment._id)
                                }
                                className={`text-muted-foreground hover:text-foreground text-xs ${
                                  reply.liked ? "text-primary" : ""
                                }`}
                              >
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                {reply.likes || 0}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentSection;
