import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import mareAvatar1Light from "@/assets/logos/mare-avatar-nobg.png";
import mareAvatar2Light from "@/assets/logos/mare-avatar2-nobg.png";
import mareAvatar1Dark from "@/assets/logos/mare-avatar.jpg";
import mareAvatar2Dark from "@/assets/logos/mare-avatar2.jpg";

const lightAvatarImages = [mareAvatar1Light, mareAvatar2Light];
const darkAvatarImages = [mareAvatar1Dark, mareAvatar2Dark];

export function BrandHeader({ size = "default" }: { size?: "default" | "small" }) {
  const { theme } = useTheme();
  const [avatarIndex, setAvatarIndex] = useState(0);
  const avatarImages = theme === "dark" ? darkAvatarImages : lightAvatarImages;

  useEffect(() => {
    const interval = setInterval(() => {
      setAvatarIndex((prev) => (prev + 1) % avatarImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [avatarImages]);

  const imgSize = size === "small" ? "h-11 w-11" : "h-12 w-12 sm:h-14 sm:w-14";
  const titleSize = size === "small" ? "text-base" : "text-base sm:text-lg";
  const subSize = size === "small" ? "text-[10px]" : "text-xs sm:text-sm";

  return (
    <div className="flex items-center gap-2.5">
      <a href="https://www.instagram.com/ganaconmare" target="_blank" rel="noopener noreferrer" className={`${imgSize} rounded-xl ${theme === "dark" ? "bg-black" : "bg-white"} flex items-center justify-center overflow-hidden`}>
        <img src={avatarImages[avatarIndex]} alt="Gana Con Mare" className="h-full w-full object-cover transition-opacity duration-300" />
      </a>
      <div className="leading-tight">
        <a href="https://www.instagram.com/ganaconmare" target="_blank" rel="noopener noreferrer" className={`font-display font-bold ${titleSize} tracking-wide text-primary block hover:text-primary/80 transition-colors`}>GANA CON MARE</a>
        <a href="https://www.instagram.com/ganaconmare" target="_blank" rel="noopener noreferrer" className={`${subSize} text-muted-foreground hover:text-primary transition-colors block`}>@ganaconmare</a>
        <a href="https://www.instagram.com/maredorazio" target="_blank" rel="noopener noreferrer" className={`${subSize} text-muted-foreground hover:text-primary transition-colors block`}>@maredorazio</a>
      </div>
    </div>
  );
}
