# TypeFlow

A modern typing practice application built with Next.js, React, and TypeScript. TypeFlow helps users improve speed, accuracy, and keyboard fluency through timed typing sessions, weak-key tracking, and real-world sentence practice.

## Features

- Timed typing tests with configurable duration and difficulty
- Multiple practice modes including standard, custom text, and weak-key drills
- Category-based sentence sets and realistic English typing passages
- Live WPM, accuracy, and progress tracking
- Keyboard guide and virtual keyboard feedback
- Ghost pacer to encourage consistent typing rhythm
- Local progress/history tracking in the browser
- Responsive design for desktop and mobile-friendly practice

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Vitest
- Playwright

## Project Structure

```text
.
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── navigation/
│   ├── results/
│   └── typing/
├── data/
├── hooks/
├── lib/
├── public/
├── tests/
├── types/
├── next.config.mjs
├── package.json
├── playwright.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Available Scripts

```bash
npm run dev        # Start the development server
npm run build      # Create a production build
npm run start      # Run the production build
npm run lint       # Run ESLint checks
npm run test       # Run unit tests with Vitest
npm run test:watch # Watch tests during development
npm run test:coverage # Run tests with coverage report
npm run test:e2e   # Run end-to-end tests with Playwright
```

## Usage

1. Choose a typing mode and difficulty.
2. Select a practice category or enter custom text.
3. Start the session and type the highlighted text as accurately and quickly as possible.
4. Review your results, accuracy, and weak-key trends after the session.
5. Continue improving with repeated practice and weak-key drills.

## Notes

This project stores user preferences and session history locally in the browser to support a lightweight, privacy-friendly typing practice experience.

## License

MIT.
