# VELOUR Luxury Perfume Shop

A high-end, single-page luxury perfume shop e-commerce application built with Next.js 14, Turso, Drizzle ORM, Paystack, and Resend.

## Tech Stack
- Next.js 14 App Router (React, TypeScript)
- Database: Turso (libSQL) + Drizzle ORM
- Payments: Paystack API
- Emails: Resend
- Styling: Vanilla CSS (Custom Design System, CSS Variables)
- Animations: Framer Motion, canvas-confetti
- Notifications: Sonner

## Setup Instructions

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.local.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.local.example .env.local
   ```
   Requires:
   - Turso Database URL and Auth Token
   - Paystack Public and Secret Keys
   - Resend API Key

3. **Database Setup (Turso):**
   ```bash
   # Create a Turso database
   turso db create auryn-shop
   
   # Get the URL
   turso db show auryn-shop --url
   
   # Create an auth token
   turso db tokens create auryn-shop
   ```

4. **Initialize Database Schema:**
   Push the schema to Turso via Drizzle Kit:
   ```bash
   npx drizzle-kit push
   ```

5. **Seed the Database:**
   Seed the database with the initial 12 luxury perfume products:
   ```bash
   npx tsx lib/db/seed.ts
   ```

6. **Run the Development Server:**
   ```bash
   npm run dev
   ```

7. **Open Application:**
   Visit [http://localhost:3000](http://localhost:3000)

## Features
- Dynamic product catalog powered by Turso database
- Responsive layout with desktop filtering sidebar and mobile filtering bottom sheet
- Stateful cart powered by React Context API and synced to Local Storage
- Paystack checkout integration
- Order confirmation page with animated confetti and Resend confirmation emails
- Dynamic, data-driven Next.js App Router API Routes
- Statically generated metadata, sitemap.xml and robots.txt

## License
© 2026 VELOUR PARIS. ALL RIGHTS RESERVED.
