import { useFieldContext } from ".";
import { Label, type LabelProps } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// todo update props here to get props from the select component
export type SelectFieldOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectFieldProps = {
  labelProps?: LabelProps;
  selectProps?: React.ComponentProps<typeof Select>;
  options: SelectFieldOption[];
  placeholder?: string;
};

export function SelectField({
  labelProps,
  selectProps,
  options,
  placeholder = "Select an option",
}: SelectFieldProps) {
  const field = useFieldContext<string>();
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label {...labelProps} />
      <Select
        {...selectProps}
        value={field.state.value}
        onValueChange={field.handleChange}
      >
        <SelectTrigger
          aria-invalid={field.state.meta.errors.length > 0}
          className="w-full"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {field.state.meta.errors.length > 0 && (
        <div className="text-destructive text-sm">
          {field.state.meta.errors.map((error) => error.message).join(", ")}
        </div>
      )}
    </div>
  );
}
