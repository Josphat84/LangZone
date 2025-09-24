// app/community/page.tsx

"use client";

import { useState, createContext, useContext, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Pencil,
  Trash2,
  Clock,
  Search,
  Check,
  X,
  User,
  Flag,
} from "lucide-react";

// User and Post types
type User = {
  id: string;
  name: string;
  role: "Member" | "Tutor" | "Admin";
  avatarUrl: string;
};

type Comment = {
  id: number;
  user: User;
  content: string;
  createdAt: Date;
};

type Post = {
  id: number;
  user: User;
  content: string;
  votes: number;
  comments: Comment[];
  tags: string[];
  createdAt: Date;
  isEdited: boolean;
};

// Mock Data for a more realistic setup
const MOCK_USERS: User[] = [
  { id: "user-1", name: "Anna", role: "Member", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Anna" },
  { id: "user-2", name: "David", role: "Tutor", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=David" },
  { id: "user-3", name: "Maria", role: "Member", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Maria" },
  { id: "user-4", name: "You", role: "Member", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=You" },
];

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    user: MOCK_USERS[0],
    content: "How do you remember French verb conjugations?",
    votes: 12,
    comments: [
      { id: 1, user: MOCK_USERS[1], content: "Try Duolingo for daily practice!", createdAt: new Date(Date.now() - 3600000) },
      { id: 2, user: MOCK_USERS[2], content: "Flashcards help a lot!", createdAt: new Date(Date.now() - 1800000) },
    ],
    tags: ["French", "Grammar"],
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    isEdited: false,
  },
  {
    id: 2,
    user: MOCK_USERS[1],
    content: "Here’s a great YouTube playlist for learning Spanish vocabulary!",
    votes: 8,
    comments: [
      { id: 3, user: MOCK_USERS[2], content: "Thanks for sharing!", createdAt: new Date(Date.now() - 5400000) },
      { id: 4, user: MOCK_USERS[3], content: "Link please?", createdAt: new Date(Date.now() - 2700000) },
    ],
    tags: ["Spanish", "Resources"],
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    isEdited: false,
  },
];

// Context for user authentication
const UserContext = createContext<User | null>(null);
const useUser = () => useContext(UserContext);

const getRelativeTime = (date: Date) => {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
};

export default function CommunityPage() {
  const [currentUser] = useState<User>(MOCK_USERS[3]); // Mock logged-in user
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [filter, setFilter] = useState<"latest" | "trending">("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editingPostContent, setEditingPostContent] = useState("");

  const handleAddPost = () => {
    if (!newPostContent.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      user: currentUser,
      content: newPostContent,
      votes: 0,
      comments: [],
      tags: [],
      createdAt: new Date(),
      isEdited: false,
    };
    setPosts([newPost, ...posts]);
    setNewPostContent("");
  };

  const handleDeletePost = (id: number) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  const handleEditPost = (id: number, content: string) => {
    setEditingPostId(id);
    setEditingPostContent(content);
  };

  const handleUpdatePost = (id: number) => {
    if (!editingPostContent.trim()) return;
    setPosts(
      posts.map((p) =>
        p.id === id ? { ...p, content: editingPostContent, isEdited: true } : p
      )
    );
    setEditingPostId(null);
    setEditingPostContent("");
  };

  const handleVote = (id: number, type: "upvote" | "downvote") => {
    setPosts(
      posts.map((p) => {
        if (p.id === id) {
          return { ...p, votes: type === "upvote" ? p.votes + 1 : p.votes - 1 };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: number) => {
    if (!newCommentContent.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      user: currentUser,
      content: newCommentContent,
      createdAt: new Date(),
    };
    setPosts(
      posts.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
    setNewCommentContent("");
    setSelectedPost(postId); // Keep comments open
  };

  const handleReport = (type: 'post' | 'comment', id: number) => {
    alert(`Reported ${type} with ID ${id}. Thank you for helping us keep the community safe.`);
  };

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags)));
  const trendingTags = allTags.sort((a, b) => {
    const countA = posts.filter(p => p.tags.includes(a)).length;
    const countB = posts.filter(p => p.tags.includes(b)).length;
    return countB - countA;
  }).slice(0, 5);

  const filteredAndSortedPosts = posts
    .filter(post => 
      (post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
       post.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (activeTag ? post.tags.includes(activeTag) : true)
    )
    .sort((a, b) => {
      if (filter === "trending") {
        return b.votes - a.votes;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  return (
    <UserContext.Provider value={currentUser}>
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-10">
          {/* Header */}
          <header className="text-center space-y-2">
            <h1 className="text-3xl font-bold">🌍 Language Learning Community</h1>
            <p className="text-muted-foreground">
              Connect, share, and grow with learners and tutors worldwide.
            </p>
          </header>

          <Separator />

          {/* Create Post */}
          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Start a Discussion</h2>
            <div className="flex flex-col gap-2">
              <Textarea
                placeholder="Share your question, tip, or experience..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="resize-none"
              />
              <Button onClick={handleAddPost} disabled={!newPostContent.trim()}>
                Post
              </Button>
            </div>
          </Card>

          <Separator />

          {/* Community Feed with Filters and Search */}
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-semibold">Community Feed</h2>
              <div className="flex gap-2 items-center w-full md:w-auto">
                <div className="relative w-full">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button
                  variant={filter === "latest" ? "default" : "outline"}
                  onClick={() => setFilter("latest")}
                >
                  Latest
                </Button>
                <Button
                  variant={filter === "trending" ? "default" : "outline"}
                  onClick={() => setFilter("trending")}
                >
                  Trending
                </Button>
              </div>
            </div>

            {filteredAndSortedPosts.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                    No posts found.
                </div>
            )}

            {filteredAndSortedPosts.map((post) => (
              <Card key={post.id} className="shadow-sm hover:shadow-md transition">
                <CardContent className="p-4 space-y-3">
                  {/* User and Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.user.avatarUrl}
                        alt={post.user.name}
                        className="w-8 h-8 rounded-full border"
                      />
                      <div>
                        <span className="font-medium flex items-center gap-1">
                          {post.user.name}
                          {post.user.role === "Tutor" && (
                            <Badge variant="default" className="bg-green-500 text-white">Tutor</Badge>
                          )}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 inline-block mr-1" />
                          {getRelativeTime(post.createdAt)}
                          {post.isEdited && <span className="ml-1 italic">(Edited)</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={activeTag === tag ? "default" : "secondary"}
                          onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                          className="cursor-pointer"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  {editingPostId === post.id ? (
                    <Textarea
                      value={editingPostContent}
                      onChange={(e) => setEditingPostContent(e.target.value)}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2">{post.content}</p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(post.id, "upvote")}
                        className="text-green-500 hover:text-green-600"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <span className="font-bold">{post.votes}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(post.id, "downvote")}
                        className="text-red-500 hover:text-red-600"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                      className="flex items-center gap-1 hover:text-teal-600"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {post.comments.length} Comments
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleReport('post', post.id)} className="flex items-center gap-1 hover:text-red-500">
                        <Flag className="w-4 h-4" />
                        Report
                    </Button>
                    {post.user.id === currentUser.id && (
                        <>
                        {editingPostId === post.id ? (
                            <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleUpdatePost(post.id)}>
                                <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingPostId(null)}>
                                <X className="w-4 h-4" />
                            </Button>
                            </div>
                        ) : (
                            <Button size="sm" variant="outline" onClick={() => handleEditPost(post.id, post.content)}>
                            <Pencil className="w-4 h-4" />
                            </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleDeletePost(post.id)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        </>
                    )}
                  </div>

                  {/* Comments Section */}
                  {selectedPost === post.id && (
                    <div className="space-y-3 mt-4 p-4 bg-gray-50 rounded-lg">
                      {post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                          <div key={comment.id} className="text-sm border-l-2 pl-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 font-semibold">
                                    <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-5 h-5 rounded-full" />
                                    <span>{comment.user.name}</span>
                                    {comment.user.role === "Tutor" && <Badge variant="secondary">Tutor</Badge>}
                                    <span className="text-xs font-normal text-muted-foreground ml-auto">
                                        {getRelativeTime(comment.createdAt)}
                                    </span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleReport('comment', comment.id)} className="text-xs p-0 h-auto text-red-400">
                                    <Flag className="w-3 h-3" />
                                </Button>
                            </div>
                            <p className="pl-7">{comment.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm italic text-muted-foreground">No comments yet. Be the first to reply!</p>
                      )}
                      <div className="flex gap-2 mt-4 pt-2 border-t">
                        <Textarea
                          placeholder="Write a comment..."
                          value={newCommentContent}
                          onChange={(e) => setNewCommentContent(e.target.value)}
                          className="resize-none min-h-[40px]"
                        />
                        <Button onClick={() => handleAddComment(post.id)} disabled={!newCommentContent.trim()}>
                          Reply
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </section>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-12 h-12 rounded-full border" />
                <div>
                  <h3 className="font-semibold">{currentUser.name}</h3>
                  <Badge variant="default">{currentUser.role}</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Welcome back to the community!</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Popular Tags</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <Button
                  key={tag}
                  variant={activeTag === tag ? "default" : "outline"}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                >
                  {tag}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </UserContext.Provider>
  );
}