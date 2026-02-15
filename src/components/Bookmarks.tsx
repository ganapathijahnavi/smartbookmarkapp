"use client";

import { useEffect, useState, useRef } from "react";
import {
  CheckCircleIcon,
  TrashIcon,
  LinkIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { supabase } from "@/utils/supabaseClient";
import type { User } from "@supabase/supabase-js";

function FaviconOrIcon({ url }: { url: string }) {
  const [error, setError] = useState(false);

  if (url.startsWith("mailto:")) {
    return (
      <EnvelopeIcon className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
    );
  }

  let domain = "";

  try {
    domain = new URL(url).hostname;
  } catch {}

  if (!error && domain) {
    return (
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}`}
        alt="favicon"
        className="w-5 h-5 mr-2 rounded"
        style={{ background: "white" }}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <LinkIcon className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
  );
}

interface Bookmark {
  id: string;
  url: string;
  title: string;
  created_at: string;
}

export default function Bookmarks() {
  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const loadBookmarks = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("bookmarks")
      .select("id, url, title, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) setError("Failed to load bookmarks.");
    else setBookmarks(data as Bookmark[]);

    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const loadRealtime = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("bookmarks")
        .select("id, url, title, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (isMounted) {
        if (error) setError("Failed to load bookmarks.");
        else setBookmarks(data as Bookmark[]);
        setLoading(false);
      }
    };

    loadRealtime();

    const channel = supabase
      .channel("realtime:bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          if (isMounted) loadRealtime();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addBookmark = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url || !title || !user) return;

    setAdding(true);
    setError(null);

    const { error } = await supabase
      .from("bookmarks")
      .insert({ url, title, user_id: user.id });

    if (error) setError("Failed to add bookmark.");
    else {
      setUrl("");
      setTitle("");
      inputRef.current?.focus();
      await loadBookmarks();

      setToast("Bookmark added!");
      setTimeout(() => setToast(null), 2000);
    }

    setAdding(false);
  };

  const deleteBookmark = async (id: string) => {
    setDeletingId(id);
    setError(null);

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) setError("Failed to delete bookmark.");
    else {
      await loadBookmarks();

      setToast("Bookmark deleted!");
      setTimeout(() => setToast(null), 2000);
    }

    setDeletingId(null);
  };

  if (!user)
    return (
      <p className="text-center text-lg text-gray-500">
        Sign in to manage your bookmarks.
      </p>
    );

  return (
    <div className="space-y-8 w-full px-0">

      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-2 rounded shadow-lg">
          <CheckCircleIcon className="inline w-5 h-5 mr-2" />
          {toast}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={addBookmark}
        className="flex flex-col sm:flex-row gap-3 items-center bg-gray-50 dark:bg-zinc-900 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 max-w-xl mx-auto"
      >
        <input
          ref={inputRef}
          type="url"
          placeholder="Bookmark URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          required
        />

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          required
        />

        <button
          type="submit"
          disabled={adding}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <LinkIcon className="w-5 h-5" />
          {adding ? "Adding..." : "Add"}
        </button>
      </form>

      {error && <div className="text-red-600 text-center">{error}</div>}

      {/* FULL WIDTH BOOKMARKS SECTION */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 p-6">

        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Your Bookmarks
        </h2>

        {loading ? (
          <div className="text-center text-gray-500">
            Loading bookmarks...
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center text-gray-400">
            No bookmarks yet.
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">

            {bookmarks.map((b) => (
              <div
                key={b.id}
                tabIndex={0}
                className="break-inside-avoid mb-8 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl border p-8 flex flex-col min-h-[200px] transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-2xl focus:scale-105 focus:shadow-2xl cursor-pointer outline-none"
                style={{ willChange: 'transform' }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <FaviconOrIcon url={b.url} />

                  <a
                    href={b.url}
                    target="_blank"
                    className="text-xl font-bold truncate flex-1"
                  >
                    {b.title}
                  </a>
                </div>

                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="text-red-500 flex items-center gap-2 mt-auto"
                >
                  <TrashIcon className="w-5 h-5" />
                  Delete
                </button>
              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
}
