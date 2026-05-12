# Marwad Maratha — E-Commerce Web Application

**Live Site → [marwadmaratha.in](https://marwadmaratha.in)**

A production-deployed e-commerce web application for a homemade food brand, built with a modern React stack and shipped with a custom domain. The platform showcases and enables online ordering of 25+ varieties of traditional handcrafted pickles (Aachar) and Papad, combining culinary heritage from Rajasthan and Maharashtra.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [SEO & Performance](#seo--performance)

---

## Overview

Marwad Maratha is a real-world business web application with a live user base. The project demonstrates end-to-end product development — from UI design and component architecture to production deployment and domain configuration.

**Key highlights for reviewers:**
- Built and deployed a fully functional e-commerce website for a real brand
- Custom domain configured and live in production (`marwadmaratha.in`)
- SEO-optimised with Open Graph, Twitter Card, and structured meta tags
- Mobile-first, responsive design using Tailwind CSS
- Component-driven architecture using shadcn/ui and React

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui (Radix UI primitives) |
| Routing | React Router DOM |
| Deployment | Lovable Cloud |
| Version Control | Git + GitHub |
| Domain | marwadmaratha.in (custom domain) |

---

## Features

- **Product Catalogue** — Browse 25+ Aachar and Papad variants with descriptions
- **Responsive Layout** — Optimised for mobile, tablet, and desktop viewports
- **SEO Ready** — Meta tags, Open Graph, Twitter Cards, canonical URLs, robots directives
- **Performance Optimised** — Vite-based build pipeline with fast cold starts
- **Brand-Consistent UI** — Custom colour palette, typography, and visual identity
- **Contact & Ordering** — Integrated enquiry flow for customers

---

## Project Structure

```
marwad-maratha/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/        # Reusable UI components (Navbar, Footer, ProductCard, etc.)
│   ├── pages/             # Route-level pages (Home, Products, About, Contact)
│   ├── assets/            # Static images and brand assets
│   ├── lib/               # Utility functions
│   ├── App.tsx            # Root component with routing
│   └── main.tsx           # Application entry point
├── index.html             # HTML shell with SEO meta tags
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js `v18` or higher
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Navigate into the project
cd YOUR_REPO_NAME

# Install dependencies
npm install

# Start local development server
npm run dev
```

Development server runs at `http://localhost:5173`

### Available Scripts

```bash
npm run dev        # Start development server with hot module replacement
npm run build      # Type-check and build for production
npm run preview    # Preview the production build locally
```

---

## Deployment

The application is deployed on **Lovable Cloud** with a custom domain.

**Production URL:** https://marwadmaratha.in

### Deployment Workflow

1. Push changes to the `main` branch on GitHub
2. Lovable automatically detects the push and triggers a redeploy
3. Live site updates within minutes — no manual CI/CD configuration required

### Custom Domain

Domain connected via `Project > Settings > Domains` in Lovable.  
DNS records configured to point `marwadmaratha.in` to Lovable's infrastructure.

---

## SEO & Performance

The site is configured with comprehensive SEO metadata out of the box:

```html
<!-- Indexing -->
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://marwadmaratha.in" />

<!-- Open Graph — controls WhatsApp, Facebook link previews -->
<meta property="og:type" content="website" />
<meta property="og:title" content="Marwad Maratha - Homemade Aachar & Papad" />
<meta property="og:description" content="25+ varieties of handmade traditional pickles. No preservatives. Ships Pan-India." />
<meta property="og:image" content="..." />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
```

---

## Screenshots

> *(Add a screenshot of the homepage, product listing page, and mobile view here for best results)*

---

## License

© Marwad Maratha. All rights reserved.  
Brand assets, product names, and imagery are proprietary and may not be reused without permission.
