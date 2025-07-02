import { Button, type ButtonProps } from "../ui/button";
import { useFormContext } from ".";

type SubmitButtonProps = ButtonProps & {
  submiterror?: string;
};

export function SubmitButton(props: SubmitButtonProps) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <div className={"flex flex-col items-center gap-1.5"}>
          <Button type="submit" disabled={isSubmitting} {...props} />
          {props.submiterror && (
            <div className="text-destructive text-sm">{props.submiterror}</div>
          )}
        </div>
      )}
    </form.Subscribe>
  );
}
