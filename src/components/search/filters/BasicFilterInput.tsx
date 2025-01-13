import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

interface BasicFilterInputProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  step?: string;
}

export const BasicFilterInput = ({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  step,
}: BasicFilterInputProps) => {
  const handleNumericInput = (inputValue: string) => {
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    onChange(numericValue);
  };

  return (
    <div className="space-y-1.5 w-full">
      <Label className="text-xs font-medium flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => {
          if (type === "number") {
            handleNumericInput(e.target.value);
          } else {
            onChange(e.target.value);
          }
        }}
        placeholder={placeholder}
        className="h-9 text-xs border border-border/50"
        step={step}
      />
    </div>
  );
};