# Margin

> Think beside the page.

Margin is a local-first visual workspace for reading, annotating, and thinking alongside documents. Import a PDF or create a blank canvas, then draw, highlight, add movable text notes, insert images, and return to your work later from the built-in history.

Everything is stored locally in SQLite. Your documents and annotations stay on your own machine.

## Why Margin?

Most PDF readers keep annotations trapped inside the document. Margin adds dedicated space around every PDF page, giving you room to think beyond the original layout—like writing in the margins of a physical book, but with an expandable visual toolkit.

## Features

### PDF workspace

- Import and render PDFs page by page with PDF.js
- Dedicated note margins on both sides of every PDF page
- Draw and highlight directly across the document or margin area
- Add movable text notes anywhere on the page
- Preserve the original PDF aspect ratio and page order

### Blank canvas

- Create multi-page blank documents
- Add new blank pages at any time
- Import PNG, JPEG, WebP, or GIF images onto new pages
- Draw and write over imported images

### Annotation tools

- Freehand pen with custom colors
- Translucent highlighter
- Eraser
- Text notes with drag handles and delete controls
- Undo and redo for drawing strokes
- Adjustable zoom

### Local history

- Automatic background saving
- SQLite-based project history
- Reopen and continue previous projects
- Store original PDF files together with their annotations
- Persist drawings, text notes, blank pages, and imported images
- Delete projects from the history screen

## How it works

1. Choose **Import PDF** or **Create blank** from the home screen.
2. Use the left toolbar to draw, highlight, erase, or add text.
3. For PDF projects, use the side margins for extended notes.
4. For blank projects, add pages or import images from the top toolbar.
5. Margin saves changes automatically to the local SQLite database.
6. Open **History** to resume an earlier workspace.

## Tech stack

- [React 19](https://react.dev/) and TypeScript
- [Vite](https://vite.dev/) for development and production builds
- [PDF.js](https://mozilla.github.io/pdf.js/) for page-by-page PDF rendering
- [Express](https://expressjs.com/) for the local API
- [SQLite](https://www.sqlite.org/) with `better-sqlite3` for persistence
- SVG overlays for pressure-free drawing and annotations

## Getting started

Prebuilt macOS and Windows packages are available from the repository's [GitHub Actions](https://github.com/wangzhongren/Margin/actions) artifacts. Tagged versions are published under [Releases](https://github.com/wangzhongren/Margin/releases).

### Requirements

- Node.js 22 or newer
- npm

### Installation

```bash
git clone git@github.com:wangzhongren/Margin.git
cd Margin
npm install
```

### Start the app

```bash
npm run dev
```

This starts both services:

- Web app: [http://127.0.0.1:5173](http://127.0.0.1:5173)
- Local API: [http://127.0.0.1:3001](http://127.0.0.1:3001)

You can also run them separately:

```bash
npm run dev:web
npm run dev:api
```

### Desktop app for macOS

Run Margin in its own Electron window:

```bash
npm run desktop
```

Build an installable `.dmg`, a zipped application, and a standalone `.app`:

```bash
npm run dist:mac
```

Build outputs are written to `release/`. Desktop data is stored separately at:

```text
~/Library/Application Support/Margin/data/boards.sqlite
```

Unsigned local builds may require choosing **Open Anyway** in macOS **System Settings → Privacy & Security** the first time they are launched.

### Production build

```bash
npm run build
npm run preview
```

## Local data

Margin creates its SQLite database at:

```text
data/boards.sqlite
```

The database contains project metadata, annotation state, imported images, and original PDF data. Database files are excluded from Git by default.

To reset all local history, stop the application and remove `data/boards.sqlite` together with its `-shm` and `-wal` companion files.

## Project structure

```text
Margin/
├── data/                 # Local SQLite database (ignored by Git)
├── server/
│   └── index.mjs         # Express API and SQLite schema
├── src/
│   ├── App.tsx           # Workspace, PDF rendering, tools, and history UI
│   ├── history.css       # History page styles
│   ├── notes.css         # PDF margins and text-note styles
│   ├── styles.css        # Core application styles
│   └── main.tsx          # React entry point
├── index.html
├── package.json
└── vite.config.ts        # Vite configuration and API proxy
```

## Privacy

Margin is local-first. It does not upload your PDFs, images, drawings, or notes to a third-party service. Files are processed in the browser and persisted through the local API into SQLite on your machine.

## Current limitations

- Designed primarily for local desktop use
- No real-time collaboration or cloud synchronization
- Drawing undo/redo currently applies to strokes, not every text or page operation
- Exporting an annotated project back to PDF is not yet available
- Very large PDFs or embedded images may increase SQLite database size

## Roadmap

- Export annotated projects to PDF or image bundles
- Page thumbnails and faster document navigation
- Selection, resizing, and richer text formatting
- Search across projects and notes
- Keyboard shortcuts
- Optional cloud synchronization
- Collaborative workspaces

## Contributing

Issues and pull requests are welcome. If you are proposing a larger change, open an issue first so the interaction and data model can be discussed.

## License

No license has been added yet. Until one is chosen, the source code remains under the repository owner's copyright.
