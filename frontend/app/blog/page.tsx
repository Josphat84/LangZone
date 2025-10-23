"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/lib/supabase/client";

const TiptapEditor = dynamic(
  async () => {
    const { useEditor, EditorContent } = await import("@tiptap/react");
    const StarterKit = (await import("@tiptap/starter-kit")).default;
    return ({ content, onChange }: { content: string; onChange: (c: string) => void }) => {
      const editor = useEditor({
        extensions: [StarterKit],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
      });

      useEffect(() => () => editor?.destroy(), [editor]);

      return <div className="border rounded p-2 mb-4"><EditorContent editor={editor} /></div>;
    };
  },
  { ssr: false }
);

interface Blog {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  comments: string[];
  likes: number;
}

export default function ProBlogPage() {
  const supabase = getSupabaseClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      setBlogs(data.map((b: any) => ({ ...b, comments: [], likes: 0 })));
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let image_url: string | null = null;
      if (image) {
        const { data, error } = await supabase.storage.from("blog").upload(`blog-images/${Date.now()}-${image.name}`, image);
        if (error) throw error;
        image_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog/${data.path}`;
      }

      const { data: inserted, error: insertError } = await supabase.from("blogs").insert([
        {
          title,
          content,
          image_url,
          author_id: "00000000-0000-0000-0000-000000000000", // dummy UUID
          is_draft: false,
        },
      ]).select();

      if (insertError) throw insertError;

      setBlogs([{ ...inserted[0], comments: [], likes: 0 }, ...blogs]);
      setTitle("");
      setContent("");
      setImage(null);
    } catch (err) {
      console.error("Failed to save blog:", err);
      alert("Failed to save blog. Check console.");
    }
    setLoading(false);
  };

  const addComment = (blogId: string, comment: string) => {
    setBlogs(prev =>
      prev.map(b => b.id === blogId ? { ...b, comments: [...b.comments, comment] } : b)
    );
  };

  const toggleLike = (blogId: string) => {
    setBlogs(prev =>
      prev.map(b => b.id === blogId ? { ...b, likes: b.likes + 1 } : b)
    );
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a Blog</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <TiptapEditor content={content} onChange={setContent} />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="mb-4"
      />
      {image && <p className="text-sm text-gray-500 mb-2">Selected file: {image.name}</p>}

      <Button onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Save Blog"}</Button>

      <hr className="my-8" />

      <h2 className="text-xl font-bold mb-4">Blogs</h2>
      {blogs.map(blog => (
        <div key={blog.id} className="border rounded p-4 mb-4">
          <h3 className="text-lg font-semibold">{blog.title}</h3>
          {blog.image_url && <img src={blog.image_url} alt={blog.title} className="my-2 rounded" />}
          <div dangerouslySetInnerHTML={{ __html: blog.content }} className="mb-2" />

          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => toggleLike(blog.id)} className="text-blue-500">Like ({blog.likes})</button>
          </div>

          <div className="mb-2">
            {blog.comments.map((c, i) => <p key={i} className="text-sm border-b">{c}</p>)}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add comment..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addComment(blog.id, (e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
              className="flex-1 p-1 border rounded"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
