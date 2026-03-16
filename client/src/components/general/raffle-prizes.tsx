import seedLightImg from "@assets/WhatsApp_Image_2026-03-16_at_13.26.38_1773689245177.jpeg";
import seedDarkImg from "@assets/WhatsApp_Image_2026-03-16_at_13.24.30_1773689374715.jpeg";

export function RafflePrizes() {
  return (
    <div className="space-y-4 text-left">
      <div>
        <div className="space-y-3">
          <div>
            <p className="font-bold text-foreground text-lg">1er lugar - 600 <span className="!text-green-700 dark:!text-green-400">Lechuguita$</span></p>
            <p className="text-xs text-muted-foreground leading-relaxed">El ganador será el resultado de las <span className="font-bold text-foreground">10PM de Súper Gana</span><br /><span className="font-bold text-foreground">un día después de agotarse las semillas</span></p>
          </div>
          <div>
            <p className="font-bold text-foreground text-lg">2do lugar - 300 <span className="!text-green-700 dark:!text-green-400">Lechuguita$</span></p>
            <p className="text-xs text-muted-foreground leading-relaxed">El ganador será el resultado de las <span className="font-bold text-foreground">4PM de Súper Gana</span><br /><span className="font-bold text-foreground">un día después de agotarse las semillas</span></p>
          </div>
          <div>
            <p className="font-bold text-foreground text-lg">3er lugar - 100 <span className="!text-green-700 dark:!text-green-400">Lechuguita$</span></p>
            <p className="text-xs text-muted-foreground leading-relaxed">El ganador será el resultado de las <span className="font-bold text-foreground">1PM de Súper Gana</span><br /><span className="font-bold text-foreground">un día después de agotarse las semillas</span></p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-bold text-foreground mb-2">8 SEMILLAS premiadas de 25 <span className="!text-green-700 dark:!text-green-400">$</span> c/u</h4>
        <div className="flex flex-wrap gap-2 justify-start">
          {Array.from({ length: 8 }).map((_, i) => (
            <img 
              key={i} 
              src={window.matchMedia("(prefers-color-scheme: dark)").matches ? seedDarkImg : seedLightImg}
              alt="Semilla premiada"
              className="h-16 w-16 object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
