export function RafflePrizes() {
  const specialNumbers = ["2222", "0241", "5555", "9999", "1994", "2000", "2026", "0101", "1111", "0422"];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-bold text-foreground mb-2">Top de Compras</h4>
        <div className="space-y-1 text-xs text-foreground font-bold">
          <p>1er Lugar 600 <span className="!text-green-700 dark:!text-green-400">Lechuguitas$</span>, 10 pm de SUPER GANA</p>
          <p>2do Lugar 300 <span className="!text-green-700 dark:!text-green-400">Lechuguitas$</span>, 4pm de SUPER GANA</p>
          <p>3er Lugar 100 <span className="!text-green-700 dark:!text-green-400">Lechuguitas$</span>, 10Am de SUPER GANA</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-foreground mb-2">8 semillas especiales de 25 <span className="!text-green-700 dark:!text-green-400">Lechuguitas$</span> cada una</h4>
        <p className="text-xs text-foreground leading-relaxed">
          {specialNumbers.join(" - ")}
        </p>
      </div>
    </div>
  );
}
