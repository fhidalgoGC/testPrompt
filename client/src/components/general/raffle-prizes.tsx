import { useEffect, useState } from "react";
import seedLightImg from "@assets/WhatsApp_Image_2026-03-16_at_13.37.15_1773689852230.jpeg";
import seedDarkImg from "@assets/WhatsApp_Image_2026-03-16_at_13.24.30_1773689374715.jpeg";
import { PrizeItem } from "./prize-item";

export function RafflePrizes() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-4 text-left">
      <div>
        <br />
        <br />
        <div className="space-y-3">
          <PrizeItem place="1er lugar" amount={600} time="10PM" />
          <PrizeItem place="2do lugar" amount={300} time="4PM" />
          <PrizeItem place="3er lugar" amount={100} time="1PM" />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-foreground mb-2">
          8 SEMILLAS premiadas de 25{" "}
          <span className="!text-green-700 dark:!text-green-400">$</span> c/u
        </h4>
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
