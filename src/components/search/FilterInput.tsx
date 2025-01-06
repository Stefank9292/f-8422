import { LucideIcon } from "lucide-react";
import { SearchDatePicker } from "./inputs/SearchDatePicker";
import { SearchTextInput } from "./inputs/SearchTextInput";

interface FilterInputProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  isDatePicker?: boolean;
  helpText?: string;
}

export const FilterInput = ({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  isDatePicker,
  helpText,
}: FilterInputProps) => {
  if (isDatePicker) {
    return (
      <SearchDatePicker
        icon={icon}
        label={label}
        value={value}
        onChange={onChange}
        helpText={helpText}
      />
    );
  }

  return (
    <SearchTextInput
      icon={icon}
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      helpText={helpText}
    />
  );
};