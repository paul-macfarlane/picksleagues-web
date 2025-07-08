import { useFieldContext } from ".";
import { Label, type LabelProps } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  type SelectProps,
  type SelectContentProps,
  type SelectTriggerProps,
} from "@/components/ui/select";

// todo update props here to get props from the select component
export type SelectFieldOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectFieldProps = {
  labelProps?: LabelProps;
  selectProps?: SelectProps;
  selectContentProps?: SelectContentProps;
  selectTriggerProps?: SelectTriggerProps;
  options: SelectFieldOption[];
  placeholder?: string;
  externalError?: string;
};

export function SelectField({
  labelProps,
  selectProps,
  options,
  placeholder = "Select an option",
  externalError,
  selectContentProps,
  selectTriggerProps,
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
          {...selectTriggerProps}
          aria-invalid={field.state.meta.errors.length > 0}
          className="w-full"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent {...selectContentProps}>
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
      {(externalError || field.state.meta.errors.length > 0) && (
        <div className="text-destructive text-sm">
          {externalError ||
            field.state.meta.errors.map((error) => error.message).join(", ")}
        </div>
      )}
    </div>
  );
}
