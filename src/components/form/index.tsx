import { createFormHookContexts, createFormHook } from "@tanstack/react-form";
import { TextField } from "./text-field";
import { SubmitButton } from "./submit-button";
import { SelectField } from "./select-field";
import { NumberField } from "./number-field";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    SelectField,
    NumberField,
  },
  formComponents: {
    SubmitButton,
  },
});

export { useAppForm };
