import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface SelectCantSeedsProps {
  quantity: number;
  onChange: (value: number) => void;
  min: number;
  step: number;
  max: number;
  quickAmounts: number[];
}

export function SelectCantSeeds({ quantity, onChange, min, step, max, quickAmounts }: SelectCantSeedsProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline" size="icon"
          className="h-12 w-12 rounded-full border-border text-foreground"
          onClick={() => onChange(Math.max(min, quantity - step))}
          disabled={quantity <= min}
          data-testid="button-decrease-qty"
        >
          <Minus className="h-5 w-5" />
        </Button>
        <div className="w-24 text-center">
          <span className="block bg-secondary/50 border border-border rounded-md text-center text-3xl font-display font-bold h-14 leading-[3.5rem]" data-testid="text-quantity">
            {quantity}
          </span>
        </div>
        <Button
          variant="outline" size="icon"
          className="h-12 w-12 rounded-full border-border text-foreground"
          onClick={() => onChange(Math.min(max, quantity + step))}
          disabled={quantity >= max}
          data-testid="button-increase-qty"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {quickAmounts.map(amt => (
          <Button
            key={amt}
            variant={quantity === amt ? "default" : "outline"}
            size="sm"
            className={`min-w-[3rem] ${quantity === amt ? "" : "border-border text-muted-foreground"}`}
            onClick={() => onChange(amt)}
            data-testid={`button-quick-${amt}`}
          >
            {amt}
          </Button>
        ))}
      </div>
    </div>
  );
}
