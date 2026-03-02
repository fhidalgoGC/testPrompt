import React from "react";
import { useRaffles } from "@/hooks/use-raffles";
import { RaffleCard } from "@/components/raffle-card";
import { motion } from "framer-motion";
import { Flame, Info, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { data: raffles, isLoading } = useRaffles();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-r-2 border-accent rounded-full animate-[spin_1.5s_linear_reverse_infinite]"></div>
            <div className="absolute inset-4 border-b-2 border-white/20 rounded-full animate-[spin_2s_linear_infinite]"></div>
            <Flame className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary w-8 h-8 animate-pulse text-glow" />
          </div>
          <p className="font-display tracking-[0.2em] text-primary/80 uppercase text-sm animate-pulse">
            Initializing Protocol
          </p>
        </div>
      </div>
    );
  }

  // Separate featured (first one) and the rest
  const featuredRaffle = raffles?.[0];
  const gridRaffles = raffles?.slice(1) || [];

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground selection:bg-primary/30 selection:text-white">
      {/* Premium Header/Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-primary to-yellow-600 rounded-sm flex items-center justify-center transform rotate-45">
              <span className="font-display font-black text-black -rotate-45 text-lg">A</span>
            </div>
            <span className="font-display font-bold text-xl tracking-wider uppercase text-glow">
              Apex<span className="text-primary">Draw</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="text-white hover:text-primary transition-colors">Campaigns</a>
            <a href="#" className="hover:text-white transition-colors">Previous Winners</a>
            <a href="#" className="hover:text-white transition-colors">How it works</a>
          </div>
          <button className="px-5 py-2 rounded-full border border-white/10 hover:border-primary/50 text-sm font-medium transition-all hover:bg-white/5">
            Connect Wallet
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        {/* Background decorative elements */}
        <div className="absolute top-40 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3 h-3" />
            <span>Redefining Ownership</span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-black font-display tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Acquire <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-200 to-primary text-glow">Excellence.</span><br />
            Defy the Odds.
          </motion.h1>
          
          <motion.p 
            className="text-lg text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Exclusive allocation events for the world's most sought-after machinery. 
            The draw protocol activates the exact millisecond 100% capacity is reached.
          </motion.p>
        </div>

        {/* Featured Raffle */}
        {featuredRaffle && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold uppercase tracking-wider flex items-center gap-2">
                <Flame className="text-primary w-5 h-5" /> 
                Priority Campaign
              </h2>
            </div>
            <RaffleCard raffle={featuredRaffle} featured={true} />
          </motion.div>
        )}
      </section>

      {/* Grid Section */}
      {gridRaffles.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <h2 className="text-2xl font-display font-bold uppercase tracking-wider">
              Active Allocations
            </h2>
            
            <div className="relative w-full md:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search assets..." 
                className="pl-10 bg-secondary/50 border-white/10 focus-visible:border-primary/50 focus-visible:ring-primary/20 h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridRaffles.map((raffle, index) => (
              <motion.div
                key={raffle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <RaffleCard raffle={raffle} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Information footer */}
      <section className="mt-16 px-4 max-w-4xl mx-auto text-center border-t border-white/5 pt-16">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-6">
          <Info className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="font-display text-xl font-bold mb-4">Protocol Integrity</h3>
        <p className="text-muted-foreground text-sm leading-loose">
          Every campaign operates on a strict capacity constraint. The cryptographic draw algorithm remains completely dormant until 100% of the allocation is secured. All participants have mathematically equal probability of selection per entry. The protocol is immutable once initiated.
        </p>
      </section>
    </div>
  );
}
