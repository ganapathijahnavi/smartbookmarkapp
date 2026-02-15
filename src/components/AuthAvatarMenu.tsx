"use client";
import { useEffect, useState } from "react";
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { supabase } from "@/utils/supabaseClient";
import type { User } from "@supabase/supabase-js";

export default function AuthAvatarMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  // Functions must be defined before use in JSX
  const signInWithGoogle = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({ provider: "google" });
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    window.location.reload();
  };

  const signOutHandler = () => {
    setOpen(false);
    signOut();
  };

  if (loading) return <button disabled>Loading...</button>;
  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Sign in with Google
      </button>
    );
  }

  const email = user.email || "";
  const name = user?.user_metadata?.name || "";
  const avatarLetter = name ? name[0].toUpperCase() : (email ? email[0].toUpperCase() : "?");

  return (
    <div className="flex items-center gap-4 relative">
      <div
        className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl cursor-pointer select-none"
        onClick={() => setOpen((v) => !v)}
        tabIndex={0}
        onBlur={() => setOpen(false)}
        aria-label="User menu"
      >
        {avatarLetter}
      </div>
      {open && (
        <div className="absolute right-0 mt-2 z-10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-xl px-4 py-3 shadow-lg min-w-[200px] border border-gray-200 dark:border-zinc-700 flex flex-row items-center gap-4">
          <div className="text-xs text-gray-500 dark:text-gray-300 whitespace-nowrap">{email}</div>
        </div>
      )}
      <button
        onClick={signOutHandler}
        className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white px-4 py-2 rounded-lg font-semibold transition shadow focus:outline-none focus:ring-2 focus:ring-red-400 border-none"
        title="Sign out"
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
        <span>Sign out</span>
      </button>
    </div>
  );
}