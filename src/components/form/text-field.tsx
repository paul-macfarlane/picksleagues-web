import { useFieldContext } from ".";
import { Label, type LabelProps } from "@/components/ui/label";
import { Input, type InputProps } from "@/components/ui/input";

type TextFieldProps = {
  labelProps?: LabelProps;
  inputProps?: InputProps;
};

export function TextField({ labelProps, inputProps }: TextFieldProps) {
  const field = useFieldContext<string>();
  return (
    <div className="flex flex-col gap-2">
      <Label {...labelProps} />
      <Input
        {...inputProps}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.errors.length > 0 && (
        <div className="text-destructive text-sm">
          {field.state.meta.errors.map((error) => error.message).join(", ")}
        </div>
      )}
    </div>
  );
}
