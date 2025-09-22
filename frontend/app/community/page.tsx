// Community Page

'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function CommunityPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Anna (Beginner)",
      content: "How do you remember French verb conjugations?",
      likes: 12,
      comments: 4,
    },
    {
      id: 2,
      user: "David (Intermediate)",
      content: "Here’s a great YouTube playlist for learning Spanish vocabulary!",
      likes: 8,
      comments: 2,
    },
  ]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold">🌍 Language Learning Community</h1>
        <p className="text-muted-foreground">
          Connect, share, and grow with learners and tutors worldwide.
        </p>
      </header>

      {/* Create Post */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">Start a Discussion</h2>
        <div className="flex gap-2">
          <Input placeholder="Share your question or tip..." />
          <Button>Post</Button>
        </div>
      </Card>

      {/* Community Feed */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Latest Discussions</h2>
        {posts.map((post) => (
          <Card key={post.id} className="shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{post.user}</span>
                <Badge variant="secondary">New</Badge>
              </div>
              <p>{post.content}</p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>👍 {post.likes} Likes</span>
                <span>💬 {post.comments} Comments</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Language Groups */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Language Groups</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["English Learners", "French Learners", "Shona Learners", "Spanish Learners"].map((group, i) => (
            <Card key={i} className="p-4 text-center hover:shadow-md transition">
              <h3 className="font-semibold">{group}</h3>
              <Button className="mt-2 w-full" variant="outline">
                Join Group
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Member Spotlight */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Member Spotlight 🌟</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <h3 className="font-medium">Most Active Learner</h3>
            <p>Maria (Advanced)</p>
          </Card>
          <Card className="p-4 text-center">
            <h3 className="font-medium">Top Helper</h3>
            <p>James (Tutor)</p>
          </Card>
          <Card className="p-4 text-center">
            <h3 className="font-medium">Best Newcomer</h3>
            <p>Fatima (Beginner)</p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center py-8 bg-muted rounded-2xl">
        <h2 className="text-2xl font-bold mb-2">🚀 Start a discussion today!</h2>
        <Button size="lg">Create a Post</Button>
      </div>
    </div>
  );
}



