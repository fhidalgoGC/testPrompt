import { useEffect, useState } from "react";
import seedLightImg from "@assets/WhatsApp_Image_2026-03-16_at_13.37.15_1773689852230.jpeg";
import seedDarkImg from "@assets/WhatsApp_Image_2026-03-16_at_13.24.30_1773689374715.jpeg";

export function RafflePrizes() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-4 text-left">
      <div>
        <div className="space-y-3">
          <div>
            <p className="font-bold text-foreground text-xs">1er lugar - 600 <span className="!text-green-700 dark:!text-green-400">Lechuguita$</span></p>
            <p className="text-xs text-muted-foreground leading-relaxed text-[0.65rem]">El ganador será el resultado de las <span className="font-bold text-foreground">10PM de Súper Gana</span><br /><span className="font-bold text-foreground">un día después de agotarse las semillas</span></p>
          </div>
          <div>
            <p className="font-bold text-foreground text-xs">2do lugar - 300 <span className="!text-green-700 dark:!text-green-400">Lechuguita$</span></p>
            <p className="text-xs text-muted-foreground leading-relaxed text-[0.65rem]">El ganador será el resultado de las <span className="font-bold text-foreground">4PM de Súper Gana</span><br /><span className="font-bold text-foreground">un día después de agotarse las semillas</span></p>
          </div>
          <div>
            <p className="font-bold text-foreground text-xs">3er lugar - 100 <span className="!text-green-700 dark:!text-green-400">Lechuguita$</span></p>
            <p className="text-xs text-muted-foreground leading-relaxed text-[0.65rem]">El ganador será el resultado de las <span className="font-bold text-foreground">1PM de Súper Gana</span><br /><span className="font-bold text-foreground">un día después de agotarse las semillas</span></p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-foreground mb-2">8 SEMILLAS premiadas de 25 <span className="!text-green-700 dark:!text-green-400">$</span> c/u</h4>
        <div className="flex flex-nowrap gap-0 justify-center">
          {Array.from({ length: 8 }).map((_, i) => (
            <img 
              key={i} 
              src={isDark ? seedDarkImg : seedLightImg}
              alt="Semilla premiada"
              className="h-10 w-10 object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
