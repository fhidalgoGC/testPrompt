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
- `client/src/pages/home.tsx` - Main landing page
- `client/src/components/raffle-card.tsx` - Raffle card component
- `client/src/components/buy-ticket-dialog.tsx` - Number picker dialog
- `client/src/components/ui/visual-progress.tsx` - Animated progress bar
- `client/src/hooks/use-raffles.ts` - React Query hooks
