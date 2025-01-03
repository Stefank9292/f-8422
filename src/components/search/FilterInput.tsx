import { HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface FilterInputProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  helpText?: string;
  type?: string;
}

export const FilterInput = ({ 
  icon: Icon, 
  label, 
  value, 
  onChange, 
  placeholder, 
  helpText,
  type = "text"
}: FilterInputProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-500" />
        <label className="text-sm font-medium">{label}</label>
        {helpText && <HelpCircle className="w-4 h-4 text-gray-400" />}
      </div>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
    </div>
  );
};