import { ChevronDown } from "lucide-react";
import { useId } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: ReadonlyArray<SelectOption>;
  onChange: (value: string) => void;
  className?: string;
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  className = "",
}: SelectFieldProps) {
  const selectId = useId();

  return (
    <div className={className}>
      <label htmlFor={selectId} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full cursor-pointer appearance-none rounded-full border border-line bg-surface pr-10 pl-4 text-sm text-fg transition-colors hover:border-accent-line"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
      </div>
    </div>
  );
}
