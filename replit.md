# Raffle App - ApexDraw

## Overview
A premium visual raffle application for cars and motorcycles. Users can browse active raffles, select specific ticket numbers from a grid navigator, and purchase them. The raffle draw only activates once 100% of tickets (9999) are sold.

## Architecture
- **Frontend**: React + Vite, Tailwind CSS, shadcn/ui, framer-motion
- **Backend**: Express.js, PostgreSQL with Drizzle ORM
- **Styling**: Dark premium theme with gold/amber accents

## Key Features
- Visual progress bar showing percentage sold (not exact numbers)
- Number picker with range navigation (1-100, 101-200, etc.)
- Sold numbers shown as unavailable, selected numbers highlighted
- Search functionality to jump to a specific number
- Confetti celebration on successful purchase
- Buyer name required for each purchase
- i18n support: Spanish (default) and English, toggle in nav bar
- Purchase confirmation step with motivational message before final buy
- Mobile-responsive: Drawer on mobile, Dialog on desktop; 5-col grid on mobile, 10-col on desktop

## Internationalization (i18n)
- Context provider in `client/src/lib/i18n.tsx`
- Locale stored in localStorage, defaults to "es"
- Toggle button in nav bar switches between es/en
- All UI strings use translation keys from `useI18n()` hook

## Database Schema
- `raffles`: id, title, description, imageUrl, totalTickets (9999), soldTickets
- `tickets`: id, raffleId, ticketNumber, buyerName (unique constraint on raffleId+ticketNumber)

## API Endpoints
- `GET /api/raffles` - List all raffles
- `GET /api/raffles/:id/tickets` - Get all sold ticket numbers for a raffle
- `POST /api/raffles/:id/buy` - Buy specific ticket numbers (body: { ticketNumbers: number[], buyerName: string })

## File Structure
- `shared/schema.ts` - Drizzle tables and types
- `shared/routes.ts` - API contract with Zod
- `server/routes.ts` - Express route handlers + seed function
- `server/storage.ts` - Database storage layer
- `client/src/lib/i18n.tsx` - i18n provider and translations
- `client/src/pages/home.tsx` - Main landing page
- `client/src/components/raffle-card.tsx` - Raffle card component
- `client/src/components/buy-ticket-dialog.tsx` - Number picker dialog with confirmation step
- `client/src/components/ui/visual-progress.tsx` - Animated progress bar
- `client/src/hooks/use-raffles.ts` - React Query hooks
