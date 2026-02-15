"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  CheckCircleIcon,
  TrashIcon,
  LinkIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

import { supabase } from "@/utils/supabaseClient";

import type { User } from "@supabase/supabase-js";





function WebsitePreviewWithLogo({ url }: { url: string }) {
  const [error, setError] = useState(false);
  let domain: string | undefined;
  if (url.startsWith("mailto:")) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-800">
        <EnvelopeIcon className="w-8 h-8 text-blue-500" />
      </div>
    );
  }
  try {
    domain = new URL(url).hostname;
  } catch {}
  return (
    <div className="relative w-full h-full flex-1">
      {url.startsWith("http") && !error ? (
        <iframe
          src={url}
          title="Website preview"
          className="absolute inset-0 w-full h-full rounded-xl border bg-white"
          sandbox="allow-scripts allow-same-origin allow-popups"
          loading="lazy"
          onError={() => setError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800" />
      )}
      {/* Logo overlay */}
      <div className="absolute top-2 left-2 bg-white/80 dark:bg-zinc-900/80 rounded-full p-1 shadow">
        {domain ? (
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}`}
            alt="favicon"
            className="w-6 h-6 rounded"
            onError={() => setError(true)}
          />
        ) : (
          <LinkIcon className="w-6 h-6 text-indigo-500" />
        )}
      </div>
    </div>
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
  const [loading, setLoading] = useState(true);
  const [bookmarkUrl, setBookmarkUrl] = useState("");
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadBookmarks = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setBookmarks(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    };
    getUser();
  }, []);





  // Load bookmarks on initial user login
  useEffect(() => {
    if (user) {
      loadBookmarks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        loadBookmarks
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadBookmarks]);





  async function addBookmark(e: React.FormEvent) {
    e.preventDefault();
    if (!bookmarkUrl || !title || !user) return;
    setAdding(true);
    // Optimistically add to UI
    const tempId = `temp-${Date.now()}`;
    const optimisticBookmark = {
      id: tempId,
      url: bookmarkUrl,
      title,
      created_at: new Date().toISOString(),
    };
    setBookmarks((prev) => [optimisticBookmark, ...prev]);
    await supabase.from("bookmarks").insert({
      url: bookmarkUrl,
      title,
      user_id: user.id,
    });
    setBookmarkUrl("");
    setTitle("");
    inputRef.current?.focus();
    setToast("Bookmark added");
    setTimeout(() => setToast(null), 2000);
    setAdding(false);
  }



  async function deleteBookmark(id: string) {
    setDeletingId(id);
    // Optimistically remove from UI
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);
    setToast("Bookmark deleted");
    setTimeout(() => setToast(null), 2000);
    setDeletingId(null);
  }


  if (!user)
    return (
      <div className="text-center py-20 text-zinc-400">
        Sign in to manage your bookmarks
      </div>
    );


  return (

    <div className="w-full px-6 py-10">


      {/* Toast */}

      {toast && (

        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-xl shadow-lg flex gap-2 z-50">

          <CheckCircleIcon className="w-5 h-5 text-green-400"/>

          {toast}

        </div>

      )}


      {/* FORM */}

      <form
        onSubmit={addBookmark}
        className="w-full flex flex-col lg:flex-row gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm"
      >


        <input
          ref={inputRef}
          type="url"
          placeholder="Bookmark URL"
          value={bookmarkUrl}
          onChange={(e) => setBookmarkUrl(e.target.value)}
          required
          className="flex-1 px-4 py-3 border rounded-lg bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-indigo-500 outline-none"
        />


        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="flex-1 px-4 py-3 border rounded-lg bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-indigo-500 outline-none"
        />


        <button
          type="submit"
          disabled={adding}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold"
        >
          {adding ? "Adding..." : "Add"}
        </button>


      </form>


      {/* BOOKMARK GRID */}

      <div className="mt-10">


        {loading ? (

          <div className="text-center text-zinc-400">
            Loading bookmarks...
          </div>

        ) : (

          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">

            {bookmarks.map((b) => (


              <div
                key={b.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl aspect-square p-5 shadow-sm flex flex-col group transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:border-indigo-500 cursor-pointer relative"
                tabIndex={0}
                onClick={e => {
                  // Prevent click if delete button is pressed
                  if ((e.target as HTMLElement).closest('button')) return;
                  window.open(b.url, '_blank', 'noopener');
                }}
                role="link"
                aria-label={`Open ${b.title}`}
              >
                <div className="flex flex-col items-center mb-4 transition-colors duration-200 group-hover:text-indigo-600 h-full">
                  <div className="relative w-full flex-1 aspect-square mb-2">
                    <WebsitePreviewWithLogo url={b.url} />
                  </div>
                  <span
                    className="font-semibold truncate transition-colors duration-200 group-hover:text-indigo-600 w-full text-center"
                  >
                    {b.title}
                  </span>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    deleteBookmark(b.id);
                  }}
                  disabled={deletingId === b.id}
                  className="mt-auto text-red-500 hover:text-white hover:bg-red-500 text-sm flex items-center gap-2 rounded px-2 py-1 transition-colors duration-200 opacity-80 group-hover:opacity-100"
                >
                  <TrashIcon className="w-4 h-4"/>
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
