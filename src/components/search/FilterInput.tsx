import { LucideIcon } from "lucide-react";
import { BasicFilterInput } from "./filters/BasicFilterInput";
import { DatePickerInput } from "./filters/DatePickerInput";

interface FilterInputProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  isDatePicker?: boolean;
  helpText?: string;
  step?: string;
}

export const FilterInput = ({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  isDatePicker,
  step,
}: FilterInputProps) => {
  if (isDatePicker) {
    return (
      <DatePickerInput
        icon={icon}
        label={label}
        value={value}
        onChange={onChange}
      />
    );
  }

  return (
    <BasicFilterInput
      icon={icon}
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      step={step}
    />
  );
};