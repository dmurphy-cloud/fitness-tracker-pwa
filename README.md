# FitTrack - PWA Fitness Tracker

A Progressive Web App (PWA) for tracking workouts and weight loss progress. Designed to work like a native app on iPhone with offline support.

## Features

- **4-Day Workout Split Program**
  - Day 1: Chest & Triceps
  - Day 2: Back & Biceps
  - Day 3: Shoulders & Abs
  - Day 4: Legs

- **Workout Logging**
  - Track sets, reps, and weights
  - Progressive overload tracking (shows previous weights)
  - Rest timer between sets
  - Form tips for each exercise

- **Exercise Library**
  - 25+ exercises with form tips
  - Filter by muscle group or equipment
  - Detailed instructions for proper form

- **Progress Tracking**
  - Weight tracking with visual charts
  - Workout history and statistics
  - Weekly progress view

- **PWA Features**
  - Works offline after initial load
  - Installable to home screen
  - Native-like experience on iOS/Android
  - Dark mode support

## Tech Stack

- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- IndexedDB for local data persistence
- Chart.js for data visualization
- vite-plugin-pwa for service worker

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fitness-tracker-pwa

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import the repository in Vercel
3. Deploy (Vercel auto-detects Vite projects)

### Deploy to Netlify

1. Push to GitHub
2. Connect repository in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

## Adding to iPhone Home Screen

1. Open the deployed app in Safari
2. Tap the Share button (rectangle with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in the top right corner

The app will now appear as a native app icon on your home screen and work offline.

## PWA Icons

For production, replace the placeholder icons in `/public` with properly sized PNG icons:

- `pwa-192x192.png` - 192x192 pixels
- `pwa-512x512.png` - 512x512 pixels
- `apple-touch-icon.png` - 180x180 pixels

You can use tools like [Real Favicon Generator](https://realfavicongenerator.net/) to generate all required icon sizes from a single source image.

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/         # React context for state management
├── data/            # Exercise and workout program data
├── db/              # IndexedDB database layer
├── hooks/           # Custom React hooks
├── pages/           # Page components
└── types/           # TypeScript type definitions
```

## Customization

### Adding Exercises

Edit `src/data/exercises.ts` to add new exercises with:
- Name and ID
- Target muscle groups
- Equipment required
- Form tips

### Modifying Workout Program

Edit `src/data/programs.ts` to customize:
- Workout day names
- Exercise selection per day
- Target sets and reps
- Rest periods

## License

MIT
