import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

interface SearchTextInputProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  helpText?: string;
}

export const SearchTextInput = ({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  helpText,
}: SearchTextInputProps) => {
  const handleNumericInput = (inputValue: string) => {
    if (type === "number") {
      const numericValue = inputValue.replace(/[^0-9]/g, '');
      onChange(numericValue);
    } else {
      onChange(inputValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => handleNumericInput(e.target.value)}
        placeholder={placeholder}
        className="h-10"
      />
      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};