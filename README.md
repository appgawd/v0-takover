# CarMeets Web Application Clone

This project is a 1:1 clone of the CarMeets mobile application, re-implemented as a mobile-responsive web application. It aims to replicate the core functionalities and user interface of the original APK, providing a platform for car enthusiasts to find and create car meet takeovers.

**Disclaimer:** This application is developed for educational purposes, specifically for a college paper, to demonstrate web development and UI/UX replication. It does not endorse or facilitate illegal activities such as street racing or blocking public roads.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [AI Readability and Rebuild Instructions](#ai-readability-and-rebuild-instructions)

## Features

### Core Application Features:
- **User Authentication (Conceptual):** Placeholder for user login/registration.
- **Home Page:** Displays quick actions, featured takeovers, and live activity.
- **Events Page:** Lists upcoming and past car meet events.
- **Clubs Page:** Shows various car clubs with member counts and activity.
- **Marketplace Page:** A conceptual section for buying/selling car parts or vehicles.
- **Profile Page:** User-specific page with garage, activity feed, and achievements.

### Takeover Management:
- **Create Takeover:** Users can create new takeovers with the following definitions:
  - **Location:** Specific meeting point.
  - **Time and Duration:** Date, time, and estimated length of the event.
  - **Privacy:** Option for public or invite-only events.
- **Find Takeovers:** Discover takeovers happening nearby.

### Map Integration (Customized):
- **Interactive Map:** Displays car meet locations using Leaflet.js and OpenStreetMap.
- **Custom Dark Theme:** Map style customized to match the website's dark theme with specific neon green shades for roads and points of interest.
  - **Highways:** Bright electric green (`#00ff00`) for maximum visibility and neon effect.
  - **Arterial Roads:** Vibrant green (`#00ff55`) for major streets.
  - **Local Roads:** Dark green (`#009933`) for smaller streets.
  - **Parking/Business Areas:** Dark green-black (`#001a0d`) with neon green text.
  - **Text:** Various shades of bright green (`#00ff88`, `#66ff99`, `#ccffdd`).
- **Fullscreen Toggle:** Allows users to expand the map to fullscreen for an immersive experience.
- **Location-based Filtering:** (Conceptual) Ability to filter takeovers based on proximity.
- **Custom Markers:** Visually distinct markers for user location, live events, and upcoming events.
- **Interactive Popups:** Display takeover details on marker click.

## Technologies Used

### Frontend:
- **React.js:** JavaScript library for building user interfaces.
- **Vite:** Fast build tool for modern web projects.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Lucide React:** A collection of beautiful, open-source icons.
- **react-leaflet:** React components for Leaflet maps.
- **leaflet:** JavaScript library for interactive maps.
- **react-leaflet-fullscreen:** React component for fullscreen map control.
- **screenfull:** Simple wrapper for the HTML5 Fullscreen API.

### Development Tools:
- **pnpm:** Fast, disk space efficient package manager.
- **Git:** Version control system.

## Project Structure

```
carmeets-clone/
├── public/
├── src/
│   ├── assets/           # Static assets like images
│   │   └── app-images/   # Images extracted from the original APK
│   ├── components/       # Reusable React components
│   │   ├── common/       # Generic components
│   │   ├── layout/       # Layout-specific components (Header, BottomNavigation)
│   │   └── takeover/     # Components related to takeover features (CreateTakeoverModal)
│   ├── pages/            # Main application pages (HomePage, EventsPage, MapPage, ClubsPage, MarketplacePage, ProfilePage)
│   ├── styles/           # Custom CSS styles (e.g., dark-map.css)
│   ├── App.jsx           # Main application component
│   ├── App.css           # Global CSS for the app
│   └── main.jsx          # Entry point for the React application
├── .gitignore            # Specifies intentionally untracked files to ignore
├── index.html            # Main HTML file
├── package.json          # Project metadata and dependencies
├── pnpm-lock.yaml        # pnpm lock file
├── README.md             # Project README file
├── setup.sh              # Setup script for Linux
├── setup_mac.sh          # Setup script for Mac
└── vite.config.js        # Vite configuration file
```

## Setup and Installation

To set up and run this project locally, ensure you have Node.js (which includes npm) and pnpm installed on your system.

### For Linux:

```bash
./setup.sh
```

### For macOS:

```bash
./setup_mac.sh
```

### Manual Setup (if scripts are not used or fail):

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd carmeets-clone
    ```
2.  **Install pnpm (if not already installed):**
    ```bash
    npm install -g pnpm
    ```
3.  **Install dependencies:**
    ```bash
    pnpm install
    ```

## Running the Application

To start the development server:

```bash
pnpm run dev
```

The application will typically be accessible at `http://localhost:5173` in your web browser.

## Deployment

To create a production-ready build of the application:

```bash
pnpm run build
```

This will generate optimized static assets in the `dist/` directory, which can then be deployed to static hosting services like Vercel, Netlify, or GitHub Pages.

## AI Readability and Rebuild Instructions

This `README.md` is designed to be highly readable by AI tools (like Manus) for project understanding, analysis, and automated rebuilding. Key aspects for AI readability include:

-   **Structured Sections:** Clear headings and subheadings for easy parsing.
-   **Explicit Technology Stack:** All major frameworks, libraries, and tools are listed with their purpose.
-   **Detailed Feature Descriptions:** Each feature is broken down, including its purpose and implementation details (e.g., map styling parameters).
-   **Code Snippets for Setup:** Direct commands for installation and running the project are provided.
-   **File Structure Overview:** A clear directory tree helps AI understand the project layout.
-   **Version Control System (Git):** Assumed for project management and cloning.

### To rebuild this project using an AI agent (e.g., Manus):

1.  **Environment Setup:** Ensure a Linux-like environment with Node.js, pnpm, and Git installed.
2.  **Clone Repository:** The AI should first clone the project repository.
    ```bash
    git clone <repository_url>
    ```
3.  **Navigate to Project Directory:**
    ```bash
    cd carmeets-clone
    ```
4.  **Execute Setup Script:** The AI should identify the appropriate `setup.sh` (for Linux) or `setup_mac.sh` (for macOS) and execute it.
    ```bash
    ./setup.sh # or ./setup_mac.sh
    ```
    *Alternatively, if scripts are not preferred or fail, the AI can follow the 

