# Marwad Maratha — E-Commerce Web Application

**Live Site → [marwadmaratha.in](https://marwadmaratha.in)**

> ⚠️ **This project is currently under active development.** Some pages and features are incomplete. The site is live and serving real customers while improvements are being made continuously.

A production-deployed e-commerce web application for a real homemade food brand. The platform showcases 25+ varieties of traditional handcrafted pickles (Aachar) and Papad, combining culinary heritage from Rajasthan and Maharashtra — live on a custom domain and actively serving customers across India.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [SEO & Performance](#seo--performance)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

Marwad Maratha is a real-world business web application — not a tutorial or demo project. It is live, indexed by search engines, and used by actual customers.

This project was initiated using **[Lovable](https://lovable.dev)** — an AI-powered web application builder — which scaffolded the initial UI, component structure, and project setup. The codebase was then connected to GitHub and deployed independently on Vercel with a custom domain configured through Hostinger.

As a beginner developer, this project represents my first real-world shipped product — going from zero knowledge to a live, deployed, domain-hosted web application.

**Key highlights:**
- Real brand, real customers, live in production at a custom domain
- Built with AI assistance (Lovable) and deployed independently via Vercel
- Custom domain (`marwadmaratha.in`) purchased via Hostinger, DNS pointed to Vercel
- Automatic CI/CD — every push to `main` triggers a live deployment on Vercel
- SEO-optimised with Open Graph, Twitter Cards, canonical URLs, and robots directives
- Mobile-first responsive design using Tailwind CSS

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
| AI Builder | Lovable (initial scaffold & UI generation) |
| Hosting | Vercel |
| Domain Registrar | Hostinger |
| Version Control | Git + GitHub |

---

## Features

### Currently Live
- **Product Catalogue** — Aachar and Papad variants with descriptions
- **Responsive Layout** — Optimised across mobile, tablet, and desktop viewports
- **SEO Ready** — Full meta tag setup including Open Graph and Twitter Cards
- **Brand Identity** — Custom colour palette, typography, and visual design
- **Contact & Enquiry** — Customer reach-out flow

### In Progress
- Product images for all variants (partially uploaded)
- Order placement and checkout flow
- Payment gateway integration

---

## Project Structure

```
marwad_maratha/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/        # Reusable UI components (Navbar, Footer, ProductCard, etc.)
│   ├── pages/             # Route-level pages (Home, Products, About, Contact)
│   ├── assets/            # Images and brand assets
│   ├── lib/               # Utility functions
│   ├── App.tsx            # Root component with routing
│   └── main.tsx           # Application entry point
├── index.html             # HTML shell with SEO meta tags
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
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
git clone https://github.com/ParthVerma1906/marwad_maratha.git

# Navigate into the project
cd marwad_maratha

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

Hosted on **Vercel**, connected to this GitHub repository for automatic deployments.

**Production URL:** https://marwadmaratha.in

### Deployment Workflow

1. Push changes to the `main` branch on GitHub
2. Vercel automatically detects the push and triggers a new build
3. On successful build, the live site updates — no manual steps required

Every pull request also gets its own **Vercel Preview URL** for reviewing changes before they go live.

### Custom Domain Setup

- Domain `marwadmaratha.in` registered via **Hostinger**
- DNS A records configured in Hostinger dashboard to point to Vercel's infrastructure
- SSL/HTTPS certificate automatically provisioned and renewed by Vercel

---

## SEO & Performance

```html
<!-- Indexing -->
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://marwadmaratha.in" />

<!-- Open Graph — WhatsApp, Facebook, LinkedIn previews -->
<meta property="og:type" content="website" />
<meta property="og:title" content="Marwad Maratha - Homemade Aachar & Papad" />
<meta property="og:description" content="25+ varieties of handmade traditional pickles. No preservatives. Ships Pan-India." />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
```

---

## Roadmap

- [ ] Complete product image uploads for all 25+ variants
- [ ] Online order placement and checkout flow
- [ ] UPI payment gateway integration
- [ ] WhatsApp order notification system
- [ ] Customer reviews and ratings section
- [ ] Admin dashboard for order management using Telegram Bot

---

## Screenshots

>> <img width="1900" height="976" alt="Screenshot 2026-05-12 225923" src="https://github.com/user-attachments/assets/45cd009c-c5f3-47c9-a358-2826fc1b1b9b" />
<img width="1919" height="1077" alt="Screenshot 2026-05-12 225854" src="https://github.com/user-attachments/assets/9ee299b2-cbdc-43b7-83fc-27fd2746f429" />


---

## License

© Marwad Maratha. All rights reserved.  
Brand assets, product names, and imagery are proprietary and may not be reused without permission.
