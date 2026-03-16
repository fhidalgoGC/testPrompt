import { ReactNode } from "react";

interface ContinueButtonProps {
  icon: ReactNode;
  text: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  iconPosition?: "left" | "right";
}

export function ContinueButton({ 
  icon, 
  text, 
  onClick, 
  className = "",
  disabled = false,
  iconPosition = "left"
}: ContinueButtonProps) {
  const iconWithBackground = (
    <div className="bg-green-700 dark:bg-green-600 rounded-lg p-2 flex items-center justify-center">
      {icon}
    </div>
  );

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-gradient-to-r from-green-600 to-green-500 dark:from-green-500 dark:to-green-400 hover:from-green-700 hover:to-green-600 dark:hover:from-green-600 dark:hover:to-green-500 border border-black rounded-xl px-6 py-4 flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      data-testid="button-continue"
    >
      {iconPosition === "left" && iconWithBackground}
      <span className="text-lg font-bold text-white">{text}</span>
      {iconPosition === "right" && iconWithBackground}
    </button>
  );
}
