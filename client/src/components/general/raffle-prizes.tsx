export function RafflePrizes() {
  const specialNumbers = ["2222", "0241", "5555", "9999", "1994", "2000", "2026", "0101", "1111", "0422"];

  return (
    <div className="space-y-4 text-center">
      <div>
        <div className="space-y-3 text-xs">
          <div>
            <p className="font-bold text-foreground">1er lugar - 600 <span className="!text-green-700 dark:!text-green-400">lechuguita$</span></p>
            <p className="text-muted-foreground leading-relaxed">El ganador será el resultado de las <span className="font-bold text-foreground">10PM de Súper Gana un día después de agotarse las semillas</span></p>
          </div>
          <div>
            <p className="font-bold text-foreground">2do lugar - 300 <span className="!text-green-700 dark:!text-green-400">lechuguita$</span></p>
            <p className="text-muted-foreground leading-relaxed">El ganador será el resultado de las <span className="font-bold text-foreground">4PM de Súper Gana un día después de agotarse las semillas</span></p>
          </div>
          <div>
            <p className="font-bold text-foreground">3er lugar - 100 <span className="!text-green-700 dark:!text-green-400">lechuguita$</span></p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-bold text-foreground mb-2">8 SEMILLAS premiadas de 25 <span className="!text-green-700 dark:!text-green-400">lechuguita$</span> C/U</h4>
        <p className="text-xs text-foreground leading-relaxed">
          {specialNumbers.join(" - ")}
        </p>
      </div>
    </div>
  );
}
