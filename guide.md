# ArenaX: Multi-Sport Platform — Quick Run Guide

A local-first multi-sport discovery and subscription web platform connecting players with sports arenas across major metros. Discover venues, book trial sessions with included equipment, subscribe to flexible plans, and engage in community games.

> [!IMPORTANT]
> **Zero Heavy Backend Dependencies:** ArenaX runs entirely within the browser using standard modern HTML5, CSS3, and ES6+ JavaScript. User preferences, bookings, and posts are stored locally via an auto-detecting `StateManager` engine (`localStorage` with transparent in-memory fallback), making it instant to launch locally or deploy statically.

---

## Table of Contents

- [How to Run](#how-to-run)
  - [Option A: Local Server (Development)](#option-a-local-server-development)
  - [Option B: Direct Browser Launch](#option-b-direct-browser-launch)
  - [Option C: Static Web Hosting](#option-c-static-web-hosting)
- [Performance & Optimization](#performance--optimization)
- [Usage Basics & Interface Map](#usage-basics--interface-map)
  - [1. Arena Discovery & Filtering](#1-arena-discovery--filtering)
  - [2. Booking a Trial Session](#2-booking-a-trial-session)
  - [3. Subscribing to a Plan](#3-subscribing-to-a-plan)
  - [4. Community Interaction](#4-community-interaction)
  - [5. Profile & Saved Arenas](#5-profile--saved-arenas)
- [Automated & Testing Suites](#automated--testing-suites)
- [Directory Index Checklist](#directory-index-checklist)

---

## How to Run

### Option A: Local Server (Development)

**Prerequisites:** Any standard HTTP static file server (Node `serve`, Python, VS Code Live Server).

```powershell
# Python 3 static server
python -m http.server 8000
```
or
```powershell
# Node.js serve package
npx serve ./
```

Open your browser at `http://localhost:8000` (or the port indicated by your server).

### Option B: Direct Browser Launch

No local server setup is strictly required. Navigate to the project root directory and double-click `index.html` to launch directly in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option C: Static Web Hosting

ArenaX requires no server-side compilation or node build pipeline. Deploy directly to static hosting platforms:
- **Vercel**: `vercel --prod`
- **Netlify**: Upload workspace directory directly to Netlify Drop.
- **GitHub Pages**: Configure branch `main` root `/` under Repository Settings -> Pages.

---

## Performance & Optimization

| Mechanism | Purpose | Technical Implementation |
|---|---|---|
| **Local State Manager** | Near-instant persistence without API latency | `StateManager.get()` / `StateManager.set()` using `localStorage` |
| **CSS Custom Variables** | Centralized design tokens and theme consistency | Managed in `:root` inside `styles.css` |
| **Debounced Search** | Smooth real-time filtering without DOM thrashing | Filter event listeners in `app.js` |
| **Image Fallbacks** | Prevents broken visual layouts | `onerror` image replacement handlers |

---

## Usage Basics & Interface Map

### 1. Arena Discovery & Filtering
- Use the **City Dropdown** (`#citySelect`) to filter sports facilities by location (e.g. Mumbai, Bengaluru, Delhi NCR).
- Type in the **Search Bar** (`#searchInput`) to match arena names or landmarks. Press `✕` (`#searchClearBtn`) to clear.
- Click any **Sport Chip** (`#sportFilters`) to isolate specific sports (e.g., Badminton, Football, Pickleball).

### 2. Booking a Trial Session
- Scroll to **Try Before You Commit** (`#trial-offers`).
- Click **Book Trial** on any card to launch the trial booking modal.
- Select your target date, time slot, and number of players. Equipment (rackets, balls, shoes) is provided automatically at no extra cost.

### 3. Subscribing to a Plan
- Browse **Subscription Plans** (`#plans`) to compare Flex Pass, Pro Player, Elite Unlimited, and Multi-Sport Pass options.
- Click **Select Plan** to open the subscription modal, select payment frequency, and activate your plan into `StateManager`.

### 4. Community Interaction
- Navigate to **Community** (`#community`).
- Click **Create Post** (`#btnCreatePost`) to submit game invitations, player searches, or tournament announcements.
- Filter community discussions by sport (`#communityFilterSport`) or city (`#communityFilterCity`).

### 5. Profile & Saved Arenas
- Click the **Profile** button (`#btnProfile`) in the top-right navbar to reveal the slide-out Profile Drawer.
- View active subscription tier, upcoming booked sessions, saved arenas, and earned reward points.

---

## Automated & Testing Suites

ArenaX includes standalone HTML test suites to verify responsive design, touch interactions, and cross-browser stability:

```powershell
# Open browser compatibility test suite
start test-browser-compatibility.html

# Open responsive design breakpoint suite
start test-responsive.html

# Open touch interaction and gesture suite
start test-touch-interactions.html
```

---

## Directory Index Checklist

The table below maps all key codebase files and directories to their functional roles within the ArenaX project:

| File / Path | Type | Functional Purpose |
|---|---|---|
| [index.html](file:///c:/Users/Felix/Documents/Website/ArenaX/index.html) | HTML5 | Primary single-page application structure, markup templates, and accessibility attributes. |
| [styles.css](file:///c:/Users/Felix/Documents/Website/ArenaX/styles.css) | CSS3 | Main design system, HSL color tokens, dark mode styles, glassmorphic card layouts, and responsive media queries. |
| [app.js](file:///c:/Users/Felix/Documents/Website/ArenaX/app.js) | JS (ES6+) | Core application controller, `StateManager` storage fallback engine, modal handlers, dynamic render routines, and filter event bindings. |
| [data.js](file:///c:/Users/Felix/Documents/Website/ArenaX/data.js) | JS (ES6+) | Initial datasets for problems, market opportunity stats, arena listings, trial session passes, subscription tiers, and community posts. |
| [logo.png](file:///c:/Users/Felix/Documents/Website/ArenaX/assets/logo.png) | Asset | Official primary ArenaX brand logo icon. |
| [logo+tagline.png](file:///c:/Users/Felix/Documents/Website/ArenaX/assets/logo+tagline.png) | Asset | Combined horizontal logo mark with tagline text asset. |
| [tagline.png](file:///c:/Users/Felix/Documents/Website/ArenaX/assets/tagline.png) | Asset | Standalone ArenaX tagline typography asset. |
| [test-browser-compatibility.html](file:///c:/Users/Felix/Documents/Website/ArenaX/test-browser-compatibility.html) | HTML Test | Automated feature detection suite testing `localStorage`, ES6 Arrow functions, CSS Grid, and Flexbox support. |
| [test-responsive.html](file:///c:/Users/Felix/Documents/Website/ArenaX/test-responsive.html) | HTML Test | Viewport breakpoint verification runner for mobile (320px-480px), tablet (768px), and desktop views. |
| [test-touch-interactions.html](file:///c:/Users/Felix/Documents/Website/ArenaX/test-touch-interactions.html) | HTML Test | Mobile touch event, tap target sizing, and swipe gesture interaction test runner. |
| [DocumentaionInstruct/](file:///c:/Users/Felix/Documents/Website/ArenaX/DocumentaionInstruct) | Directory | Project documentation guidelines, reference layouts (`instructions.txt`), and contact API routing specs (`contact instructions.txt`). |
