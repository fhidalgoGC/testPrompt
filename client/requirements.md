## Packages
framer-motion | Essential for smooth, premium progress bar animations and page transitions
canvas-confetti | To provide a premium "celebration" micro-interaction when a user successfully buys tickets
@types/canvas-confetti | TypeScript definitions for the confetti package
lucide-react | Standard icon library for premium UI accents

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  sans: ["var(--font-sans)"],
}
API Endpoints:
- GET /api/raffles
- POST /api/raffles/:id/buy
The frontend relies heavily on visual percentages rather than raw ticket numbers as requested.
