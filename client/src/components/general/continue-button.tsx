import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface ContinueButtonProps {
  icon: ReactNode;
  text: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function ContinueButton({ 
  icon, 
  text, 
  onClick, 
  className = "",
  disabled = false 
}: ContinueButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-gradient-to-r from-green-600 to-green-500 dark:from-green-500 dark:to-green-400 hover:from-green-700 hover:to-green-600 dark:hover:from-green-600 dark:hover:to-green-500 border border-black rounded-xl px-6 py-4 flex items-center justify-between transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      data-testid="button-continue"
    >
      <div className="flex items-center gap-3 flex-1">
        {icon}
        <span className="text-lg font-bold text-white">{text}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-white flex-shrink-0" />
    </button>
  );
}
