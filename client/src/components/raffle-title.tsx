interface RaffleTitleProps {
  text: string;
  icon?: string;
}

export function RaffleTitle({ text, icon }: RaffleTitleProps) {
  return (
    <h2 className="text-4xl sm:text-5xl font-bold flex items-center justify-center gap-3" style={{ fontFamily: 'var(--font-serif)', color: 'hsl(20, 72%, 48%)', fontWeight: '700', letterSpacing: '-0.02em' }}>
      {icon && <img src={icon} alt="Semilla" className="w-16 h-16 object-contain flex-shrink-0" />}
      {text}
    </h2>
  );
}
