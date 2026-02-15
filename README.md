# Smart Bookmark App

A simple, modern bookmark manager built with Next.js (App Router), Supabase, and Tailwind CSS. Supports Google OAuth, private real-time bookmarks, and easy deployment to Vercel.

---

## Features

- **Google OAuth only**: Sign up and log in with Google (no email/password)
- **Add bookmarks**: Save a URL and title when logged in
- **Private bookmarks**: Each user sees only their own bookmarks
- **Real-time updates**: Bookmarks update instantly across tabs/devices
- **Delete bookmarks**: Remove your own bookmarks
- **Deployed on Vercel**: Live, production-ready app

---

## Live Demo

- **Vercel URL:** [Click here](https://mysmartbookmarkapp.vercel.app/)
- **GitHub Repo:** [SmartBookmarkApp](https://github.com/ganapathijahnavi/SmartBookmarkApp)

---

## Setup & Deployment (Step by Step)

### 1. Clone the Repository
```bash
git clone https://github.com/ganapathijahnavi/SmartBookmarkApp.git
cd SmartBookmarkApp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase
- Go to [supabase.com](https://supabase.com) and create a new project.
- Create a table called `bookmarks` with columns:
	- `id` (uuid, primary key, default: uuid_generate_v4())
	- `user_id` (uuid)
	- `url` (text)
	- `title` (text)
	- `created_at` (timestamp, default: now())
- Enable **Row Level Security (RLS)** on the `bookmarks` table.
- Add RLS policy: Allow users to read/write only their own bookmarks.
- Enable **Google OAuth** in Supabase Auth settings. Add your app's Vercel URL as an authorized redirect URI.
- Get your Supabase **Project URL** and **Anon Key**.

### 4. Configure Environment Variables
- Create a `.env.local` file in the project root:
	```env
	NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
	NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
	```

### 5. Run the App Locally
```bash
npm run dev
```
- Open [http://localhost:3000](http://localhost:3000) and test Google login, adding, and deleting bookmarks.

### 6. Deploy to Vercel
- Go to [vercel.com](https://vercel.com), import your GitHub repo, and set the same environment variables in the Vercel dashboard.
- Deploy the project. Vercel will build and host your app.
- Test the live URL with Google login and bookmark features.

---

## Problems & Solutions

- **Git push rejected (non-fast-forward):**
	- Solution: Run `git pull origin master --rebase`, resolve any conflicts, then `git push -u origin master`.
- **Google OAuth not working:**
	- Solution: Make sure your Supabase project has Google OAuth enabled and the correct redirect URI (your Vercel URL).
- **Bookmarks not private:**
	- Solution: Double-check RLS policy in Supabase to restrict access to user's own bookmarks.
- **Real-time not working:**
	- Solution: Ensure Supabase Realtime is enabled for the `bookmarks` table.
- **Styling issues:**
	- Solution: Use Tailwind CSS classes as shown in the codebase for a modern, responsive UI.

---

## Tech Stack
- Next.js (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS
- React
- Vercel (deployment)

---
🙋‍♀️Author--> Jahnavi Durga Ganapathi, Feel free to connect or contribute!
