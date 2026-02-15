
import Bookmarks from "@/components/Bookmarks";
import AuthButton from "@/components/AuthButton";

export default function Home() {

  return (

    <div className="w-full min-h-screen">

      {/* FULL SCREEN HERO */}

      <section
        className="
          relative
          w-full
          h-[calc(100vh-72px)]
          bg-gradient-to-br
          from-blue-400
          via-blue-300
          to-purple-400
          overflow-hidden
        "
      >


        {/* Content */}
        <div className="
          absolute
          inset-0
          flex
          flex-col
          items-center
          justify-center
          px-6
        ">
          <h1 className="
            text-5xl
            md:text-7xl
            font-extrabold
            text-black
            text-center
            mb-6
          ">
            Smart Bookmark Manager
          </h1>
          <p className="
            text-xl
            md:text-2xl
            text-black/80
            text-center
            mb-8
          ">
            Save. Organize. Access Instantly.
          </p>
          <div className="flex justify-center">
            <AuthButton />
          </div>
        </div>


        {/* Frosted Cards */}

        <div className="
          absolute
          bottom-10
          left-0
          w-full
          flex
          justify-center
          gap-6
        ">


          <div className="backdrop-blur-md bg-white/30 rounded-xl shadow-lg w-48 h-20 flex items-center justify-center text-lg font-semibold text-blue-900/80">
            🔒 Secure
          </div>

          <div className="backdrop-blur-md bg-white/40 rounded-xl shadow-xl w-64 h-28 -mt-8 z-10 flex flex-col items-center justify-center text-xl font-bold text-blue-900/90">
            <span>🔄 Sync across devices</span>
            <span className="text-base font-medium text-blue-900/70 mt-1">Realtime updates</span>
          </div>

          <div className="backdrop-blur-md bg-white/30 rounded-xl shadow-lg w-48 h-20 flex items-center justify-center text-lg font-semibold text-blue-900/80">
            🆓 Free & Open Source
          </div>

        </div>

      </section>


      {/* Bookmarks */}

      <section className="w-full bg-black pb-20">

        <Bookmarks />

      </section>

    </div>

  );

}
