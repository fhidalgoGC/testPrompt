interface PrizeItemProps {
  place: string;
  amount: number;
  time: string;
}

export function PrizeItem({ place, amount, time }: PrizeItemProps) {
  return (
    <div data-testid={`prize-item-${place}`}>
      <p className="font-bold text-foreground text-xs">
        {place} – {amount}{" "}
        <span className="!text-green-700 dark:!text-green-400">
          Lechuguita$
        </span>
      </p>
      <p className="text-xs text-muted-foreground leading-relaxed text-[0.5rem]">
        El ganador será el resultado de las{" "}
        <span className="font-bold text-foreground">
          {time} de Súper Gana
        </span>
        <br />
        <span className="font-bold text-foreground">
          un día después de agotarse las semillas
        </span>
      </p>
    </div>
  );
}
