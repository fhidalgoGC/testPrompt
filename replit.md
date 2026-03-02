# ApexDraw

## Overview
A premium vehicle draw/sorteo platform. Users can browse active campaigns, select specific ticket numbers from a grid navigator, and purchase them. The draw only activates once 100% of tickets (9999) are sold.

**Important**: The word "rifa/raffle" must NOT appear in any user-facing text. Use "sorteo/draw/campaign" instead. Internal code variable names (DB schema, API paths) still use "raffle" for consistency but are not visible to users.

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
- i18n support: Spanish (default) and English, toggle in nav bar
- Purchase flow: pick numbers → name → contact modal (phone/email/ID) → confirm → success (no OTP required to purchase)
- Mobile-responsive: Drawer on mobile, Dialog on desktop; 5-col grid on mobile, 10-col on desktop
- Navigation menu with hamburger on mobile (Sorteos, Ganadores, Como funciona, Terminos, Verificar OTP, Login)
- Terms & Conditions page at /terms
- SEO: noindex, nofollow meta tags + robots.txt blocks all crawlers

## Phone Verification (OTP)
- OTP is NOT required to complete a purchase — email/confirmation is sent regardless
- OTP code is fixed to "123456" (TODO: connect to real SMS provider)
- OTP is sent automatically when user submits contact info during purchase
- User can verify OTP later from the "Verificar OTP" menu item in the nav bar
- Standalone OTP modal: enter phone → send code or "Ya tengo codigo" → enter code → verified
- Backend stores OTP codes in memory with 5-minute expiry
- Verified phones stored in memory with 10-minute window

## Buyer Information
- Name entered in the picker panel
- Phone, email, and ID number collected in a separate contact modal
- All stored in the tickets table alongside ticket numbers

## Internationalization (i18n)
- Context provider in `client/src/lib/i18n.tsx`
- Locale stored in localStorage, defaults to "es"
- Toggle button in nav bar switches between es/en
- All UI strings use translation keys from `useI18n()` hook
- Terms content is also translated

## Database Schema
- `raffles`: id, title, description, imageUrl, totalTickets (9999), soldTickets
- `tickets`: id, raffleId, ticketNumber, buyerName, buyerPhone, buyerEmail, buyerIdNumber (unique constraint on raffleId+ticketNumber)

## API Endpoints
- `GET /api/raffles` - List all campaigns
- `GET /api/raffles/:id/tickets` - Get all sold ticket numbers for a campaign
- `POST /api/raffles/:id/buy` - Buy tickets (body: { ticketNumbers, buyerName, buyerPhone, buyerEmail, buyerIdNumber, otpCode? })
- `POST /api/otp/send` - Send OTP code to phone (body: { phone })
- `POST /api/otp/verify` - Verify OTP code (body: { phone, code })
- `GET /robots.txt` - Returns disallow-all robots.txt

## Pages
- `/` - Home page with campaign listings
- `/terms` - Terms & Conditions page

## File Structure
- `shared/schema.ts` - Drizzle tables and types
- `shared/routes.ts` - API contract with Zod
- `server/routes.ts` - Express route handlers + OTP logic + seed function + robots.txt
- `server/storage.ts` - Database storage layer
- `client/src/lib/i18n.tsx` - i18n provider and translations (includes terms content)
- `client/src/pages/home.tsx` - Main landing page with nav menu + OTP modal trigger
- `client/src/pages/terms.tsx` - Terms & Conditions page
- `client/src/components/raffle-card.tsx` - Campaign card component
- `client/src/components/buy-ticket-dialog.tsx` - Number picker + contact modal + confirmation flow
- `client/src/components/verify-otp-modal.tsx` - Standalone OTP verification modal (accessible from nav menu)
- `client/src/components/ui/visual-progress.tsx` - Animated progress bar
- `client/src/hooks/use-raffles.ts` - React Query hooks (including OTP send/verify)
