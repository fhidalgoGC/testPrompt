import { Loader2 } from "lucide-react";
import seedIconImg from "@/assets/seed-icon-nobg.png";

interface ContinueButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function ContinueButton({ 
  text, 
  onClick, 
  className = "",
  disabled = false,
  loading = false,
}: ContinueButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full h-12 bg-gradient-to-r from-green-600 to-green-500 dark:from-green-500 dark:to-green-400 hover:from-green-700 hover:to-green-600 dark:hover:from-green-600 dark:hover:to-green-500 border border-black rounded-xl px-6 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      data-testid="button-continue"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-white" />
      ) : (
        <img src={seedIconImg} alt="Semilla" className="h-7 w-7 object-contain" />
      )}
      <span className="text-base font-bold text-white">{text}</span>
    </button>
  );
}