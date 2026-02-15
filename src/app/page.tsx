import Bookmarks from "@/components/Bookmarks";
import Link from "next/link";

export default function Home() {

  return (

    <main className="
      min-h-screen
      w-full
      bg-gradient-to-br
      from-[#f6f8fc]
      via-[#f5f6fa]
      to-[#e9eef6]
      dark:from-zinc-950
      dark:via-zinc-900
      dark:to-zinc-950
    ">

      {/* Hero Section — FULL EDGE WIDTH */}

      <section className="w-full pt-24 pb-20 flex flex-col items-center justify-center text-center">
        <h1 className="w-full px-4 text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight mb-6 animate-fade-in">
          Your Smarter Bookmark Manager
        </h1>
        <p className="w-full px-4 max-w-4xl mx-auto mt-2 text-2xl md:text-3xl text-zinc-600 dark:text-zinc-300 animate-fade-in">
          Save, organize, and access your bookmarks instantly. Built for speed, simplicity, and real-time sync.
        </p>
        <div className="mt-12 animate-fade-in">
          <Link
            href="/login"
            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xl px-12 py-5 rounded-2xl shadow-lg transition-all duration-200 hover:scale-[1.04] active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Get Started
          </Link>
        </div>
      </section>


      {/* Bookmarks Section — FULL EDGE WIDTH */}

      <section className="w-full pb-20">

        <Bookmarks />

      </section>


    </main>

  );

}
