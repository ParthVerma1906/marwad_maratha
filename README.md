# Marwad Maratha — E-Commerce Web Application

**Live Site → [marwadmaratha.in](https://marwadmaratha.in)**

A production-deployed e-commerce web application for a homemade food brand, built with a modern React stack and live on a custom domain. The platform showcases and enables online ordering of 25+ varieties of traditional handcrafted pickles (Aachar) and Papad, combining culinary heritage from Rajasthan and Maharashtra.

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

Marwad Maratha is a real-world business web application with a live user base. The project demonstrates end-to-end product development — from UI design and component architecture to production deployment with a custom domain.

**Key highlights for reviewers:**
- Fully functional e-commerce website for a real, active brand
- Custom domain (`marwadmaratha.in`) purchased via Hostinger, DNS configured to Vercel
- Deployed on Vercel with automatic GitHub-based CI/CD
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
| Hosting | Vercel |
| Domain Registrar | Hostinger |
| Version Control | Git + GitHub |
| Domain | marwadmaratha.in |

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

The application is hosted on **Vercel**, connected to this GitHub repository for automatic deployments.

**Production URL:** https://marwadmaratha.in

### Deployment Workflow

1. Push changes to the `main` branch
2. Vercel automatically detects the push and triggers a new build
3. On successful build, changes go live — zero manual steps required

Every pull request also gets its own **Vercel Preview URL**, allowing changes to be reviewed before merging to production.

### Custom Domain Setup

- Domain `marwadmaratha.in` registered via **Hostinger**
- DNS nameservers / A records pointed to Vercel's infrastructure from the Hostinger dashboard
- SSL certificate automatically provisioned by Vercel

---

## SEO & Performance

The site is configured with comprehensive SEO metadata:

```html
<!-- Indexing -->
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://marwadmaratha.in" />

<!-- Open Graph — controls WhatsApp, Facebook, LinkedIn link previews -->
<meta property="og:type" content="website" />
<meta property="og:title" content="Marwad Maratha - Homemade Aachar & Papad" />
<meta property="og:description" content="25+ varieties of handmade traditional pickles. No preservatives. Ships Pan-India." />
<meta property="og:image" content="..." />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
```

---

## Screenshots

> *(Recommended: add a screenshot of the homepage, product listing page, and mobile view)*

---

## License

© Marwad Maratha. All rights reserved.  
Brand assets, product names, and imagery are proprietary and may not be reused without permission.
