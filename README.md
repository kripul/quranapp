# Al-Quran Digital (Mobile Mushaf)

A premium, mobile-first Al-Quran application built with Next.js, featuring a smooth Mushaf reading experience with RTL support, swipe gestures, and full offline capabilities as a Progressive Web App (PWA).

## ✨ Features

- **Premium Mushaf UI**: Clean, elegant design optimized for mobile devices.
- **RTL Support**: Native Right-to-Left layout for a natural reading experience.
- **Swipe Navigation**: Navigate through pages with intuitive swipe gestures (Right for Next, Left for Previous).
- **Navigation Modals**: Quickly jump to any Juz, Page, or Surah through dedicated selection modals.
- **PWA Ready**: Install the app on your home screen for an app-like experience.
- **Full Offline Support**: Read the entire Quran even without an internet connection, thanks to background pre-caching and static data extraction.
- **Continue Reading**: Automatically remembers your last read page from the homepage.

## 🚀 Tech Stack

- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Carousel/Swipe**: [Embla Carousel](https://www.embla-carousel.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: SQLite (built-time) / JSON (runtime/offline)

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kripul/quranapp.git
   cd quranapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Prepare the data (Extract Quran text from SQLite to JSON):
   ```bash
   node scripts/extract-quran-data.js
   ```

### Development

Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

### Production & Offline Build

To create a fully static, offline-capable version of the app:

1. Build the project:
   ```bash
   npm run build
   ```

2. Serve the static files (for local testing of PWA features):
   ```bash
   npx serve out
   ```

## 🌐 Deployment (Vercel)

This project is configured for **Static Export**. When deploying to Vercel:

1. Connect your repository.
2. Vercel will detect it as a Next.js project.
3. The build command will automatically run `next build`.
4. Ensure the output directory is set to `out` (Vercel usually detects this automatically when `output: 'export'` is set).

## 📄 License

This project is created for personal and educational use. Text data is derived from Uthmani script sources.
