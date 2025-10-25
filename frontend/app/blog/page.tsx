// app/community/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { getSupabaseClient } from "@/lib/supabase/client"; 
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
  Flag,
  Image as ImageIcon,
  Link as LinkIcon, 
  Code, 
} from "lucide-react";

// ------------------------------------------------------------------
// --- DYNAMICALLY IMPORT TIPTAP EDITOR WITH RICH FEATURES (FIXED) ---
// ------------------------------------------------------------------
const TiptapEditor = dynamic(
  async () => {
    // Import all necessary Tiptap components and extensions
    const { useEditor, EditorContent } = await import("@tiptap/react");
    const StarterKit = (await import("@tiptap/starter-kit")).default;
    const { default: Link } = await import("@tiptap/extension-link");
    const { Heading } = await import("@tiptap/extension-heading");
    const { CodeBlock } = await import("@tiptap/extension-code-block");

    // Define the stable client component here
    const TiptapClientComponent = ({ content, onChange, className = "" }: { content: string; onChange: (c: string) => void; className?: string }) => {
      // All hooks are called unconditionally at the top level
      const [mounted, setMounted] = useState(false);

      useEffect(() => {
          setMounted(true);
      }, []);

      const editor = useEditor({
        extensions: [
          StarterKit,
          Link.configure({ openOnClick: false, autolink: true, }),
          Heading.configure({ levels: [1, 2, 3], }),
          CodeBlock,
        ],
        content,
        // FIX: Explicitly set immediatelyRender to false to prevent Next.js/Tiptap hydration error
        immediatelyRender: false, 
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
      }, [mounted]); 

      // Cleanup hook is always called
      useEffect(() => {
        if (!editor) return; 
        return () => {
            editor.destroy();
        };
      }, [editor]); 
      
      // useCallback is always called
      const setLink = useCallback(() => {
        if (!editor) return; 
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) return; 
        if (url === '') { 
          editor.chain().focus().extendMarkRange('link').unsetLink().run();
          return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      }, [editor]);


      const MenuBar = () => {
        if (!editor) return null;
        return (
          <div className="flex flex-wrap gap-1 p-1 border-b mb-2">
            <Button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={`p-1 h-auto text-sm ${editor.isActive('bold') ? 'bg-gray-200' : 'bg-transparent'}`}
              variant="ghost"
              title="Bold"
            >
              **B**
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={`p-1 h-auto text-sm italic ${editor.isActive('italic') ? 'bg-gray-200' : 'bg-transparent'}`}
              variant="ghost"
              title="Italic"
            >
              *I*
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1 h-auto text-sm ${editor.isActive('bulletList') ? 'bg-gray-200' : 'bg-transparent'}`}
              variant="ghost"
              title="Bullet List"
            >
              • List
            </Button>
            {[1, 2, 3].map(level => (
                <Button
                    key={level}
                    onClick={() => editor.chain().focus().toggleHeading({ level: level as 1|2|3 }).run()}
                    className={`p-1 h-auto text-sm font-semibold ${editor.isActive('heading', { level: level }) ? 'bg-gray-200' : 'bg-transparent'}`}
                    variant="ghost"
                    title={`Heading ${level}`}
                >
                    H{level}
                </Button>
            ))}
            <Button
              onClick={setLink}
              className={`p-1 h-auto text-sm ${editor.isActive('link') ? 'bg-blue-200' : 'bg-transparent'}`}
              variant="ghost"
              title="Add Link"
            >
              <LinkIcon className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-1 h-auto text-sm ${editor.isActive('codeBlock') ? 'bg-gray-200' : 'bg-transparent'}`}
              variant="ghost"
              title="Code Block"
            >
              <Code className="w-4 h-4" />
            </Button>
          </div>
        );
      };

      if (!mounted || !editor) {
        return <div className={`border rounded mb-4 ${className} p-2 text-sm text-muted-foreground`}>Loading rich text editor...</div>;
      }

      return (
        <div className={`border rounded mb-4 ${className}`}>
          <MenuBar />
          <EditorContent editor={editor} className="p-2 min-h-[100px]" />
        </div>
      );
    };
    
    // Return the stable component reference
    return TiptapClientComponent;
  },
  { ssr: false }
);


// ------------------------------------------------------------------
// --- TYPE DEFINITIONS & MOCK DATA (No mock comments) ---
// ------------------------------------------------------------------
interface SupabasePost {
  id: string | number;
  title: string | null;
  content: string;
  image_url?: string | null;
  created_at: string;
  author_id: string; 
  is_draft: boolean;
}

type User = {
  id: string;
  name: string;
  role: "Member" | "Tutor" | "Admin" | "Anonymous";
  avatarUrl: string;
};

type Comment = {
  id: number;
  user: User;
  content: string;
  createdAt: Date;
};

interface CommunityPost {
  id: number;
  user: User;
  title: string | null;
  content: string;
  image_url?: string | null;
  votes: number;
  comments: Comment[]; 
  tags: string[]; 
  createdAt: Date;
  isEdited: boolean;
}

const UUID_ANON = "00000000-0000-0000-0000-000000000001"; 
const UUID_ANNA = "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890";
const UUID_DAVID = "b2c3d4e5-f678-90a1-b2c3-d4e5f67890a1";

const ANONYMOUS_USER: User = { 
  id: UUID_ANON, 
  name: "Anonymous User", 
  role: "Anonymous", 
  avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Anon" 
};

const MOCK_USERS: User[] = [
  { id: UUID_ANNA, name: "Anna", role: "Member", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Anna" },
  { id: UUID_DAVID, name: "David (Tutor)", role: "Tutor", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=David" },
  ANONYMOUS_USER,
];

const CURRENT_USER: User = ANONYMOUS_USER; 

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

const mapSupabaseToCommunityPost = (data: SupabasePost): CommunityPost => {
  const user = MOCK_USERS.find(u => u.id === data.author_id) || ANONYMOUS_USER;
  const comments: Comment[] = []; // No mock comments

  return {
    id: typeof data.id === 'string' ? Date.parse(data.created_at) : (data.id || Date.now()),
    user,
    title: data.title,
    content: data.content,
    image_url: data.image_url,
    votes: 0, 
    comments: comments, 
    tags: ["Learning", "Discussion"], 
    createdAt: new Date(data.created_at),
    isEdited: false,
  };
};

// ------------------------------------------------------------------
// --- MAIN COMPONENT ---
// ------------------------------------------------------------------
export default function CommunityPage() {
  const supabase = getSupabaseClient();
  const [currentUser] = useState<User>(CURRENT_USER);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostImage, setNewPostImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editingPostContent, setEditingPostContent] = useState("");

  const [filter, setFilter] = useState<"latest" | "trending">("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // --- SUPABASE DATA FETCHING ---
  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase.from("blogs").select("id, title, content, image_url, created_at, author_id, is_draft").order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blogs:", error);
      return;
    }
    if (data) {
      const communityPosts: CommunityPost[] = data.map(mapSupabaseToCommunityPost);
      setPosts(communityPosts);
    }
  }, [supabase]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // --- SUPABASE POST SUBMISSION ---
  const handleAddPost = async () => {
    if (!newPostContent.trim() || !newPostTitle.trim()) {
      alert("Title and content cannot be empty.");
      return;
    }
    
    setIsSaving(true);
    try {
      let image_url: string | null = null;
      if (newPostImage) {
        const filePath = `community-images/${Date.now()}-${newPostImage.name}`;
        const { error: storageError } = await supabase.storage.from("blog").upload(filePath, newPostImage);
        
        if (storageError) throw storageError;
        
        const { data: publicUrl } = supabase.storage.from("blog").getPublicUrl(filePath);
        image_url = publicUrl.publicUrl;
      }

      const authorIdToSend = currentUser.id; 

      const { data: inserted, error: insertError } = await supabase.from("blogs").insert([
        {
          title: newPostTitle,
          content: newPostContent,
          image_url,
          author_id: authorIdToSend, 
          is_draft: false,
        },
      ]).select();

      if (insertError) throw insertError;

      if (inserted && inserted.length > 0) {
        const newCommunityPost = mapSupabaseToCommunityPost(inserted[0] as SupabasePost);
        setPosts([newCommunityPost, ...posts]);
      }
      
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostImage(null);
    } catch (err) {
      console.error("Failed to save post:", err);
      alert("Failed to save post. Check console.");
    } finally {
      setIsSaving(false);
    }
  };
  
  // --- IN-MEMORY INTERACTIONS (FOR UI) ---
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
    setSelectedPost(postId); 
  };

  const handleReport = (type: 'post' | 'comment', id: number) => {
    alert(`Reported ${type} with ID ${id}. Thank you for helping us keep the community safe.`);
  };

  // --- FILTERING AND SORTING LOGIC ---
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
       (post.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
       post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (activeTag ? post.tags.includes(activeTag) : true)
    )
    .sort((a, b) => {
      if (filter === "trending") {
        return b.votes - a.votes;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  // ------------------------------------------------------------------
  // --- RENDER ---
  // ------------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-10">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-10">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">🌍 Language Learning Community</h1>
          <p className="text-muted-foreground">
            Connect, share, and grow with learners and tutors worldwide.
          </p>
        </header>

        <Separator />

        {/* Create Post with Rich Editor */}
        <Card className="p-6 shadow-xl border-t-4 border-indigo-600">
          <h2 className="text-lg font-semibold mb-4 text-indigo-700">Post Anonymously</h2>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Title of your anonymous post..."
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="mb-2 text-lg font-medium"
            />
            
            <TiptapEditor 
              content={newPostContent} 
              onChange={setNewPostContent} 
              className="bg-white"
            />
            
            <div className="flex items-center gap-4">
              <label htmlFor="post-image-upload" className="cursor-pointer flex items-center gap-1 text-sm text-muted-foreground hover:text-indigo-600 transition">
                <ImageIcon className="w-4 h-4" />
                <span>{newPostImage ? newPostImage.name : "Add Image (Optional)"}</span>
              </label>
              <input
                id="post-image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setNewPostImage(e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>

            <Button onClick={handleAddPost} disabled={isSaving || !newPostContent.trim() || !newPostTitle.trim()} className="w-full bg-indigo-600 hover:bg-indigo-700">
              {isSaving ? "Posting..." : "Post Anonymously"}
            </Button>
          </div>
        </Card>

        <Separator />

        {/* Community Feed */}
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
                className={filter === "latest" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
              >
                Latest
              </Button>
              <Button
                variant={filter === "trending" ? "default" : "outline"}
                onClick={() => setFilter("trending")}
                className={filter === "trending" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
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
            <Card key={post.id} className="shadow-lg rounded-xl hover:shadow-xl transition-all duration-300">
              <CardContent className="p-5 space-y-4">
                
                {/* 1. Metadata Header - Clean and Concise */}
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.user.avatarUrl}
                      alt={post.user.name}
                      className="w-10 h-10 rounded-full border-2 border-indigo-400"
                    />
                    <div>
                      <span className="font-bold flex items-center gap-1 text-gray-800">
                        {post.user.name}
                        {(post.user.role === "Tutor" || post.user.role === "Admin") && (
                          <Badge className="bg-green-500 text-white text-xs">Verified {post.user.role}</Badge>
                        )}
                        {post.user.role === "Anonymous" && (
                          <Badge variant="secondary" className="text-xs">Anonymous</Badge>
                        )}
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <Clock className="w-3 h-3 inline-block mr-1" />
                        {getRelativeTime(post.createdAt)}
                        {post.isEdited && <span className="ml-2 italic text-blue-500">Edited</span>}
                      </p>
                    </div>
                  </div>
                  
                  {/* Tags on the right */}
                  <div className="flex gap-1.5 flex-wrap justify-end max-w-[50%]">
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={activeTag === tag ? "default" : "outline"}
                        onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                        className="cursor-pointer text-xs"
                      >
                        # {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* 2. Title and Content Body */}
                {post.title && <h3 className="text-2xl font-extrabold text-indigo-700">{post.title}</h3>}

                {/* Editing UI */}
                {editingPostId === post.id ? (
                  <Textarea
                    value={editingPostContent}
                    onChange={(e) => setEditingPostContent(e.target.value)}
                    className="mt-2 min-h-[150px]"
                  />
                ) : (
                  <>
                    {post.image_url && (
                        <img 
                          src={post.image_url} 
                          alt={post.title || "Post image"} 
                          className="my-3 rounded-xl max-h-80 w-full object-cover shadow-md" 
                        />
                    )}
                    {/* 💡 ENHANCEMENT: Apply Tailwind's `prose` class for better rich text rendering */}
                    <div className="prose **prose-sm** max-w-none mt-2" dangerouslySetInnerHTML={{ __html: post.content }} />
                  </>
                )}

                {/* 3. Action Bar - Elegant Row of Icon Buttons */}
                <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
                  {/* Voting & Comments */}
                  <div className="flex items-center gap-4">
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(post.id, "upvote")}
                        className="text-green-600 hover:bg-green-100 p-2 h-auto"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <span className="font-bold text-lg text-gray-900">{post.votes}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(post.id, "downvote")}
                        className="text-red-600 hover:bg-red-100 p-2 h-auto"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                      className="flex items-center gap-1 text-indigo-600 hover:bg-indigo-50"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {post.comments.length} Comments
                    </Button>
                    
                    <Button variant="ghost" size="sm" onClick={() => handleReport('post', post.id)} className="flex items-center gap-1 text-red-500 hover:bg-red-50">
                      <Flag className="w-4 h-4" />
                      Report
                    </Button>
                  </div>
                  
                  {/* Edit/Delete (Right side) */}
                  <div className="flex items-center gap-2">
                    {post.user.id === currentUser.id && (
                      <>
                      {editingPostId === post.id ? (
                        <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdatePost(post.id)} className="bg-blue-500 hover:bg-blue-600">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingPostId(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleEditPost(post.id, post.content)} className="hover:bg-gray-100">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => handleDeletePost(post.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* 4. Comments Section - Stylish Box */}
                {selectedPost === post.id && (
                  <div className="space-y-4 mt-5 p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-inner">
                    <h4 className="text-lg font-semibold border-b pb-2 text-gray-700">Discussion</h4>
                    
                    {post.comments.length > 0 ? (
                      post.comments.map((comment) => (
                        <div key={comment.id} className="text-sm p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-semibold">
                              <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-6 h-6 rounded-full border" />
                              <span>{comment.user.name}</span>
                              <span className="text-xs font-normal text-muted-foreground ml-2">
                                {getRelativeTime(comment.createdAt)}
                              </span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleReport('comment', comment.id)} className="text-xs p-0 h-auto text-red-400">
                              <Flag className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="mt-1 pl-8 text-gray-700">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm italic text-muted-foreground text-center py-2">No comments yet. Start the conversation!</p>
                    )}
                    
                    <div className="flex gap-2 mt-4 pt-2 border-t border-gray-100">
                      <Textarea
                        placeholder={`Replying as ${currentUser.name}...`}
                        value={newCommentContent}
                        onChange={(e) => setNewCommentContent(e.target.value)}
                        className="resize-none min-h-[40px]"
                      />
                      <Button onClick={() => handleAddComment(post.id)} disabled={!newCommentContent.trim()} className="bg-indigo-600 hover:bg-indigo-700">
                        Post Reply
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
        <Card className="shadow-lg">
          <CardContent className="space-y-3 pt-6">
            <div className="flex items-center gap-3">
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-14 h-14 rounded-full border-2 border-indigo-400" />
              <div>
                <h3 className="font-bold text-lg">{currentUser.name}</h3>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">{currentUser.role}</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground border-t pt-3">
                <span className="font-semibold text-gray-700">Status:</span> You are currently posting and interacting as a **Guest User**.
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-indigo-700 border-b pb-2">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <Button
                  key={tag}
                  variant={activeTag === tag ? "default" : "outline"}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={activeTag === tag ? "bg-indigo-600 hover:bg-indigo-700" : "hover:bg-gray-100"}
                >
                  #{tag}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}