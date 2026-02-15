"use client";

import { useEffect, useState } from "react";
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { supabase } from "@/utils/supabaseClient";
import type { User } from "@supabase/supabase-js";

// Avatar component
function Avatar({ avatarLetter, email }: { avatarLetter: string; email: string }) {
  return (
    <div className="relative group">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg cursor-pointer">
        {avatarLetter}
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 mt-2 z-10 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-lg">
        {email}
      </div>
    </div>
  );
}

// Sign out button component
function SignOutButton({ onSignOut }: { onSignOut: () => void }) {
  return (
    <button
      onClick={onSignOut}
      className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white px-5 py-2 rounded-full font-semibold transition shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 border-none"
      title="Sign out"
    >
      <ArrowRightOnRectangleIcon className="w-5 h-5" />
      <span>Sign out</span>
    </button>
  );
}

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    // Get current user on mount
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({ provider: "google" });
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
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

  // Alphabet avatar based on name/email
  const email = user.email || "";
  const name = user?.user_metadata?.name || "";
  const avatarLetter = name ? name[0].toUpperCase() : (email ? email[0].toUpperCase() : "?");

  // Layout: avatar and sign out side by side
  return (
    <div className="flex items-center gap-6">
      <Avatar avatarLetter={avatarLetter} email={email} />
      <SignOutButton onSignOut={signOut} />
    </div>
  );
}