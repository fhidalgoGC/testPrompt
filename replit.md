# GanaConMare (GANA CON MARE)

## Overview
A premium vehicle draw/sorteo platform. Users can browse active campaigns, select seeds (tickets), and purchase them. The draw only activates once 100% of seeds (9999) are sold.

**Important**: The word "rifa/raffle" must NOT appear in any user-facing text. Use "sorteo/draw/campaign" instead. Internal code variable names (DB schema, API paths) still use "raffle" for consistency but are not visible to users.

## Architecture
- **Frontend**: React + Vite, Tailwind CSS, shadcn/ui, framer-motion
- **Backend**: Express.js, PostgreSQL with Drizzle ORM
- **Styling**: Dark/Light mode with gold/amber accents, theme toggle in navbar

## Key Features
- Visual progress bar showing percentage sold (not exact numbers)
- Seed quantity selector (increments of 4, min 4, max 96, quick buttons: 4, 8, 12, 20, 32, 48, 96)
- Confetti celebration on successful purchase
- i18n support: Spanish (default) and English, toggle in nav bar
- Dark/Light mode toggle with ThemeProvider (`theme-context.tsx`)
- Purchase flow: select payment → quantity → upload proof → contact info → confirm → API call → success
- Purchase provider (`purchase-context.tsx`) tracks purchase state across the flow
- Mobile-responsive: Drawer on mobile, Dialog on desktop
- Reusable Navbar component (`components/navbar.tsx`) used across all pages
- SEO: noindex, nofollow meta tags + robots.txt blocks all crawlers

## Theme System
- `ThemeProvider` in `client/src/lib/theme-context.tsx`
- `.dark` / `.light` class on `<html>` element
- `darkMode: ["class"]` in tailwind config
- Green colors: `green-700` in light mode, `green-400` in dark mode
- Gold title: `.raffle-title` CSS class with theme-adaptive gradients

## Purchase Flow & Provider
- `PurchaseProvider` in `client/src/lib/purchase-context.tsx` tracks all purchase data
- Steps: payment method → quantity → payment details + proof upload → contact info → confirm
- On confirm, sends POST to `/api/purchase` with all data including proof filename
- Backend generates transactionId (TX-XXXXXXXX) and stores in `purchases` table

## Database Schema
- `raffles`: id, title, description, imageUrls[], totalTickets (9999), soldTickets
- `tickets`: id, raffleId, ticketNumber, buyerName, buyerPhone, buyerEmail, buyerIdNumber (unique on raffleId+ticketNumber)
- `coupons`: id, code, credits, used, usedByEmail
- `purchases`: id, transactionId, raffleId, quantity, buyerName, buyerPhone, buyerEmail, buyerIdNumber, paymentMethod, paymentCurrency, totalAmount, proofFilename, status

## Environment Config
- `client/src/enviroments/enviroment.ts` - Centralized config with `rifaId` and `apiBaseUrl`
- Used by `progressBar.service.ts` (stats endpoint) and `purchase-provider.tsx` (purchase endpoint)

## External API Endpoints (AWS)
- `GET /admin-raffle-config/{rifaId}` - Fetch raffle configuration
- `GET /payments-methods?limit=10` - Fetch payment methods
- `GET /rifa/estadisticas?rifaId=` - Fetch raffle statistics (total, vendidos, disponibles, porcentajes)
- `POST /rifa/registro-completo` - Submit purchase with form data

## Internal API Endpoints
- `POST /api/upload-comprobante` - Upload payment proof image (multipart, max 10MB)
- `POST /api/purchase` - Submit purchase with all data, returns { transactionId }
- `GET /robots.txt` - Returns disallow-all robots.txt

## Services
- `client/src/services/raffleConfig.service.ts` - Fetches raffle config and payment methods from AWS on app startup
- `client/src/services/progressBar.service.ts` - Fetches raffle stats from AWS endpoint, used by RaffleStats component
- `client/src/services/purchase-service.ts` - Submits purchase to AWS endpoint
- `client/src/services/exchange.ts` - Local exchange rate calculation

## Pages
- `/` - Home page with campaign listings
- `/terms` - Terms & Conditions page
- `/how-it-works` - How it works page (5 steps)
- `/redeem` - Redeem coupon page

## File Structure
- `shared/schema.ts` - Drizzle tables and types (raffles, tickets, coupons, purchases)
- `server/routes.ts` - Express route handlers (upload, purchase)
- `server/storage.ts` - Database storage layer (IStorage interface + DatabaseStorage)
- `client/src/lib/i18n.tsx` - i18n provider and translations (includes terms + how-it-works content)
- `client/src/lib/theme-context.tsx` - Dark/light theme provider
- `client/src/lib/purchase-context.tsx` - Purchase flow state provider
- `client/src/providers/raffle-config-provider.tsx` - Loads raffle config + payment methods on startup via RaffleConfigProvider, exposes useRaffleConfig() hook
- `client/src/components/navbar.tsx` - Reusable navbar component (brand, nav links, lang switch, theme toggle)
- `client/src/components/general/brand-header.tsx` - Brand logo + Instagram links (BrandHeader with "Gana con Mare" in brand yellow)
- `client/src/pages/home.tsx` - Main landing page
- `client/src/pages/terms.tsx` - Terms & Conditions page
- `client/src/pages/how-it-works.tsx` - How it works page
- `client/src/components/raffle-card.tsx` - Campaign card component
- `client/src/components/buy-ticket-dialog.tsx` - Purchase flow dialog (payment → quantity → proof → info → confirm)
- `client/src/components/ui/visual-progress.tsx` - Animated progress bar

## Styling System
- `client/src/styles/theme.css` - Brand & primary colors (Yellow: #FBBF24 light / #FCD34D dark; Green: #22c55e light / green-500 dark)
- `client/src/styles/colors.css` - Centralized color variables (grayscale, status colors)
- `client/src/styles/globals.css` - Global typography, spacing, elevation, animations, and utility classes
- `client/src/styles/components.css` - Component-specific styles (brand-header, raffle-card, buttons, badges, cards, etc.)
- All styles are imported in `client/src/index.css` and organized with @layer base/components/utilities

## Brand Colors
- **Brand Yellow**: `text-yellow-brand` (or `text-yellow-400` light / `text-yellow-300` dark)
  - Light Mode: #FBBF24 (HSL: 45 97% 77%)
  - Dark Mode: #FCD34D (HSL: 44 97% 78%)
  - Used in: "Gana con Mare" header title with black text-shadow outline
  
- **Primary Green**: `text-green-primary` (or `text-green-600` light / `text-green-500` dark)
  - Light Mode: #22c55e (green-600)
  - Dark Mode: #22c55e (green-500)
  - Used in: Progress bar, "Quiero mis Semillas" button, "Comprar/Secure Entry" button
