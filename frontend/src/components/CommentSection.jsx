import { useState } from "react";
import { MessageCircle, Reply, ThumbsUp, Heart, Send, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const mockComments = [
  {
    id: 1,
    author: {
      name: "Alex Smith",
      avatar: "/api/placeholder/40/40",
      verified: true,
    },
    content:
      "Excellent article! The Zero Trust implementation guide is exactly what our organization needed. The step-by-step approach makes it much easier to understand and implement. Thanks for sharing your expertise!",
    publishedAt: "2024-01-16T10:30:00Z",
    likes: 12,
    replies: [
      {
        id: 11,
        author: {
          name: "Sarah Chen",
          avatar: "/api/placeholder/40/40",
        },
        content:
          "Thank you, Alex! I'm glad you found it helpful. If you have any questions during implementation, feel free to ask.",
        publishedAt: "2024-01-16T11:00:00Z",
        likes: 5,
        replies: [],
      },
    ],
  },
  {
    id: 2,
    author: {
      name: "Maria Rodriguez",
      avatar: "/api/placeholder/40/40",
    },
    content:
      "Great insights on network segmentation! We've been struggling with micro-segmentation in our cloud environment. Do you have any specific recommendations for AWS?",
    publishedAt: "2024-01-16T14:15:00Z",
    likes: 8,
    replies: [],
  },
  {
    id: 3,
    author: {
      name: "David Park",
      avatar: "/api/placeholder/40/40",
      verified: true,
    },
    content:
      "This is a comprehensive guide. I particularly appreciate the focus on monitoring and analytics. SIEM integration is crucial for Zero Trust success.",
    publishedAt: "2024-01-16T16:45:00Z",
    likes: 15,
    replies: [],
  },
];

const CommentSection = () => {
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const handleLike = (commentId, isReply = false, parentId) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId
                ? {
                    ...reply,
                    likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
                    liked: !reply.liked,
                  }
                : reply
            ),
          };
        } else if (!isReply && comment.id === commentId) {
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

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: {
        name: "You",
        avatar: "/api/placeholder/40/40",
      },
      content: newComment,
      publishedAt: new Date().toISOString(),
      likes: 0,
      replies: [],
    };

    setComments((prev) => [comment, ...prev]);
    setNewComment("");

    toast.success("Your comment has been posted successfully.");
  };

  const handleAddReply = (parentId) => {
    if (!replyContent.trim()) return;

    const reply = {
      id: Date.now(),
      author: {
        name: "You",
        avatar: "/api/placeholder/40/40",
      },
      content: replyContent,
      publishedAt: new Date().toISOString(),
      likes: 0,
      replies: [],
    };

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === parentId
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      )
    );

    setReplyContent("");
    setReplyingTo(null);

    toast("Your reply has been posted successfully.");
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

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
              {comments.length +
                comments.reduce((acc, c) => acc + c.replies.length, 0)}
              )
            </h3>
          </div>
        </CardHeader>
        <CardContent>
          {/* Add Comment Form */}
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/api/placeholder/40/40" alt="Your avatar" />
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
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="border-b border-border/50 pb-6 last:border-b-0"
              >
                {/* Main Comment */}
                <div className="flex items-start gap-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={comment.author.avatar}
                      alt={comment.author.name}
                    />
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{comment.author.name}</span>
                      {comment.author.verified && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ Verified
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {formatTime(comment.publishedAt)}
                      </span>
                    </div>
                    <p className="text-foreground mb-3 leading-relaxed">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(comment.id)}
                        className={`text-muted-foreground hover:text-foreground ${
                          comment.liked ? "text-primary" : ""
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setReplyingTo(
                            replyingTo === comment.id ? null : comment.id
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
                {replyingTo === comment.id && (
                  <div className="ml-13 mb-4">
                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src="/api/placeholder/40/40"
                          alt="Your avatar"
                        />
                        <AvatarFallback>
                          <User className="w-3 h-3" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder={`Reply to ${comment.author.name}...`}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="min-h-[80px] mb-2"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAddReply(comment.id)}
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
                {comment.replies.length > 0 && (
                  <div className="ml-13 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={reply.author.avatar}
                            alt={reply.author.name}
                          />
                          <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {reply.author.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(reply.publishedAt)}
                            </span>
                          </div>
                          <p className="text-sm text-foreground mb-2 leading-relaxed">
                            {reply.content}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(reply.id, true, comment.id)}
                            className={`text-muted-foreground hover:text-foreground text-xs ${
                              reply.liked ? "text-primary" : ""
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {reply.likes}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Load More Comments */}
          <div className="text-center pt-6">
            <Button variant="outline" className="text-muted-foreground">
              Load More Comments
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentSection;
