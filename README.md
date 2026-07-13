# Qian Yun Zhang — Personal Portfolio

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)

## About

My personal portfolio website — a place to showcase my projects, career history, and the interactive experiments I enjoy building.

**Live site:** [zhangqyy19.github.io/qyz-portfolio](https://zhangqyy19.github.io/qyz-portfolio)

## Features

### Core Pages
- **About** — hero section with animated typing titles, skills overview, and random quotes
- **Experience** — vertical timeline of work and education history
- **Projects** — showcase of personal and professional projects with mockups
- **Blog** — blog posts section
- **Contact** — contact form powered by EmailJS

### Interactive Widgets
- **Weather-aware theming** — fetches live NYC weather and applies a matching visual theme overlay
- **Command palette** (Cmd+K) — quick keyboard-driven navigation inspired by developer tools
- **AI chatbot** — embedded conversational assistant widget
- **Konami code easter egg** — enter the classic code for a surprise
- **Back to top** — smooth scroll-to-top button
- **Cheat sheets** — quick reference cards
- **Mini-Games Arcade** — a collection of playable mini-games built from scratch

### Technical Highlights
- Responsive design & mobile-friendly layout
- Custom React hooks for weather, scroll animations, and theming
- SCSS modular stylesheets (one per component/page)
- Hash-based routing for GitHub Pages compatibility

## Project Structure

Below is a tree view of the project to help you find and modify everything:

```
qyz-portfolio/
├── public/                     # Static assets served as-is
│   ├── logos/                  # Company/school logos (experience section)
│   ├── index.html              # HTML entry point (page title, meta tags)
│   ├── favicon.ico             # Browser tab icon
│   └── manifest.json           # PWA manifest
│
├── src/
│   ├── assets/images/          # Background images & project mockups
│   ├── images/                 # Profile photos
│   │
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.tsx          # Navigation bar
│   │   ├── BackToTop.tsx       # Scroll-to-top button
│   │   ├── ChatBot.tsx         # AI chatbot widget
│   │   ├── CommandPalette.tsx  # Cmd+K command palette
│   │   ├── KonamiEasterEgg.tsx # Konami code easter egg
│   │   ├── RandomQuote.tsx     # Random quote display
│   │   ├── WeatherOverlay.tsx  # Weather overlay widget
│   │   └── games/              # Mini-games (Snake, 2048, Pong, etc.)
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useNYCWeather.ts    # Weather data fetching
│   │   ├── useScrollReveal.ts  # Scroll animation hook
│   │   └── useWeatherTheme.ts  # Weather-based theming
│   │
│   ├── pages/                  # Main page sections
│   │   ├── AboutPage.tsx       # About/intro section
│   │   ├── BlogPage.tsx        # Blog posts section
│   │   ├── ContactPage.tsx     # Contact form/info
│   │   ├── ExperiencePage.tsx  # Work & education timeline
│   │   ├── ProjectsPage.tsx    # Portfolio projects showcase
│   │   └── TypingGamePage.tsx  # Typing game page
│   │
│   ├── styles/                 # SCSS stylesheets (one per component/page)
│   │   ├── global.scss         # Global styles & CSS variables
│   │   ├── Navbar.scss
│   │   ├── AboutPage.scss
│   │   ├── ProjectsPage.scss
│   │   |── ExperiencePage.scss
│   │   ├── BlogPage.scss
│   │   ├── ContactPage.scss
│   │   └── ...                 # Other component styles
│   │
│   ├── App.tsx                 # Root app component (routing & layout)
│   ├── index.tsx               # React entry point
│   └── index.scss              # Base styles
│
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

### Where to modify what

| What you want to change | Where to look |
|---|---|
| Personal info, bio, skills | `src/pages/AboutPage.tsx` |
| Work/education timeline | `src/pages/ExperiencePage.tsx` |
| Portfolio projects | `src/pages/ProjectsPage.tsx` |
| Blog posts | `src/pages/BlogPage.tsx` |
| Contact form | `src/pages/ContactPage.tsx` |
| Typing game | `src/pages/TypingGamePage.tsx` |
| Navigation bar & links | `src/components/Navbar.tsx` |
| Chatbot behavior | `src/components/ChatBot.tsx` |
| Command palette actions | `src/components/CommandPalette.tsx` |
| Weather overlay | `src/components/WeatherOverlay.tsx` |
| Mini-games | `src/components/games/` |
| Profile photo | `src/images/` |
| Project mockup images | `src/assets/images/` |
| Company/school logos | `public/logos/` |
| Colors, fonts, themes | `src/styles/global.scss` |
| Routing & layout | `src/App.tsx` |
| Page title & meta tags | `public/index.html` |

## Quick Setup

1. Ensure you have [Node.js](https://nodejs.org/) installed. Check your installation by running:

    ```bash
    node -v
    ```

2. In the project directory, install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm start
    ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.

5. Customize the template by navigating to the `/src/components` directory. Modify texts, pictures, and other information as needed.

The page will reload if you make edits, and you will see any lint errors in the console.

If you are interested in creating a mockup image like the ones from the personal projects section, I recommend [Genmoo](https://gemoo.com/tools/browser-mockup-generator/). This website lets you generate sleek looking browser mockups for free.

## Deployment

You can choose your preferred service (e.g., [Netlify](https://www.netlify.com/), [Render](https://render.com/), [Heroku](https://www.heroku.com/)) for deployment. One of the easiest ways to host this portfolio is using GitHub Pages. Follow the instructions below for a production deploy.

1. **Set Up GitHub Repository**

    Create a new repository on GitHub for your portfolio app.

2. **Configure `package.json`**

    Edit the following properties in your `package.json` file:

    ```json
    {
        "homepage": "https://yourusername.github.io/your-repo-name",
        "scripts": {
            "predeploy": "npm run build",
            "deploy": "gh-pages -d build",
            ...
        }
    }
    ```

    Replace `yourusername` with your GitHub username and `your-repo-name` with the name of your GitHub repository.

3. **Deploy to GitHub Pages**

    Run the following command to deploy your app:

    ```bash
    npm run deploy
    ```

4. **Access Your Deployed App**

    After successfully deploying, you can access your app at `https://yourusername.github.io/your-repo-name`.
