export function RafflePrizes() {
  const specialNumbers = ["2222", "0241", "5555", "9999", "1994", "2000", "2026", "0101", "1111", "0422"];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-bold text-foreground mb-2">Top de Compras</h4>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>1er Lugar 600 Semillas</p>
          <p>2do Lugar 300 Semillas</p>
          <p>3er Lugar 100 Semillas</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-foreground mb-2">8 Semillas Especiales de 100 Semillas C/U</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {specialNumbers.join(" - ")}
        </p>
      </div>
    </div>
  );
}
