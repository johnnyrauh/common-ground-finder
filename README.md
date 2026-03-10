# Common Ground Finder

A nonpartisan political analysis tool that helps Americans find shared values across the political divide.

![App Screenshot](screenshot-placeholder.png)

## What It Does

Common Ground Finder uses AI to present steelmanned perspectives from both the Left and Right on hot-button political issues. For any topic, it surfaces areas of genuine agreement, identifies the deeper human values motivating each side, and provides key data points both sides should acknowledge. Users can optionally select their political party to receive a personalized insight explaining what the other side genuinely believes and why.

## Why We Built It

Most Americans share more common values than media and social media suggest. But the incentive structures of modern discourse reward outrage over understanding, and most people rarely encounter the other side's strongest arguments. Common Ground Finder is an attempt to bridge that gap with data and empathy -- presenting each perspective at its best, then showing where the overlap actually exists.

## Features

- 12 pre-populated hot-button topics + custom topic input
- Steelmanned Left and Right perspectives (no strawmanning)
- Common Ground Score (0-100) with color-coded progress bar
- Shared human values surfaced for both sides
- Key data points both sides should acknowledge
- Personalized insight based on Democrat / Independent / Republican selection

## Tech Stack

- **Frontend:** React + Vite (inline styles, no component libraries)
- **AI Model:** Anthropic Claude API (`claude-sonnet-4-20250514`)
- **Backend:** Vercel serverless functions (API proxy)
- **Deployment:** Vercel

## Getting Started

```bash
git clone https://github.com/johnnyrauh/common-ground-finder.git
cd common-ground-finder
npm install
```

Create a `.env.local` file with your Anthropic API key:

```
ANTHROPIC_API_KEY=your_key_here
```

Run the development server (uses Vercel's local runtime so the serverless function works):

```bash
vercel dev
```

The app will be available at `http://localhost:3000`.

## Live Demo

Live at: [your-vercel-url]
