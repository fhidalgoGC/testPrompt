import { ChevronRight } from "lucide-react";
import seedIconImg from "@/assets/seed-icon-nobg.png";

interface BuySeedsButtonProps {
  onClick?: () => void;
  className?: string;
}

export function BuySeedsButton({ onClick, className = "" }: BuySeedsButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-gradient-to-r from-green-600 to-green-500 dark:from-green-500 dark:to-green-400 hover:from-green-700 hover:to-green-600 dark:hover:from-green-600 dark:hover:to-green-500 border border-black rounded-xl px-6 py-4 flex items-center justify-between transition-all duration-200 active:scale-[0.98] ${className}`}
      data-testid="button-buy-seeds"
    >
      <div className="flex items-center gap-3 flex-1">
        <img src={seedIconImg} alt="Semilla" className="h-6 w-6 object-contain" />
        <span className="text-lg font-bold text-white">Quiero mis Semillas</span>
      </div>
      <ChevronRight className="h-5 w-5 text-white flex-shrink-0" />
    </button>
  );
}
