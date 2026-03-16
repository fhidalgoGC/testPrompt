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
      className={`w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 border-2 border-yellow-600 rounded-xl px-6 py-4 flex items-center justify-between transition-all duration-200 active:scale-[0.98] ${className}`}
      data-testid="button-buy-seeds"
    >
      <div className="flex items-center gap-3 flex-1">
        <img src={seedIconImg} alt="Semilla" className="h-6 w-6 object-contain" />
        <span className="text-lg font-bold text-gray-900">Quiero mis Semillas</span>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-900 flex-shrink-0" />
    </button>
  );
}
