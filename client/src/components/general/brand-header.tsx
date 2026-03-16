import { useState, useEffect } from "react";
import mareAvatar1 from "@/assets/logos/mare-avatar.jpg";
import mareAvatar2 from "@/assets/logos/mare-avatar2.jpg";

const avatarImages = [mareAvatar1, mareAvatar2];

export function BrandHeader({ size = "default" }: { size?: "default" | "small" }) {
  const [avatarIndex, setAvatarIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAvatarIndex((prev) => (prev + 1) % avatarImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const imgSize = size === "small" ? "h-10 w-10" : "h-11 w-11 sm:h-12 sm:w-12";
  const titleSize = size === "small" ? "text-base" : "text-base sm:text-lg";
  const subSize = size === "small" ? "text-[10px]" : "text-xs sm:text-sm";

  return (
    <div className="flex items-center gap-2.5">
      <a href="https://www.instagram.com/ganaconmare" target="_blank" rel="noopener noreferrer" className={`${imgSize} rounded-xl bg-muted flex items-center justify-center overflow-hidden`}>
        <img src={avatarImages[avatarIndex]} alt="Gana Con Mare" className="h-full w-full object-cover transition-opacity duration-300" />
      </a>
      <div className="leading-tight">
        <span className={`font-display font-bold ${titleSize} tracking-wide text-primary block`}>GANA CON MARE</span>
        <div className={`${subSize} text-muted-foreground flex gap-2`}>
          <a href="https://www.instagram.com/ganaconmare" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@ganaconmare</a>
          <span>•</span>
          <a href="https://www.instagram.com/maredorazio" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@maredorazio</a>
        </div>
      </div>
    </div>
  );
}
