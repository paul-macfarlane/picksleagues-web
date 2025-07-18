import { useFieldContext } from ".";
import { Label, type LabelProps } from "@/components/ui/label";
import { Input, type InputProps } from "@/components/ui/input";

export type NumberFieldProps = {
  labelProps?: LabelProps;
  inputProps?: InputProps;
};

export function NumberField({ labelProps, inputProps }: NumberFieldProps) {
  const field = useFieldContext<number | null>();
  return (
    <div className="flex flex-col gap-2">
      <Label {...labelProps} />
      <Input
        type="number"
        {...inputProps}
        value={field.state.value == null ? "" : field.state.value}
        onChange={(e) => {
          const value = e.target.value;
          field.handleChange(value === "" ? null : Number(value));
        }}
      />
      {field.state.meta.errors.length > 0 && (
        <div className="text-destructive text-sm">
          {field.state.meta.errors.map((error) => error.message).join(", ")}
        </div>
      )}
    </div>
  );
}
