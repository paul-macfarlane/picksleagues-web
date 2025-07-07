import { createFormHookContexts, createFormHook } from "@tanstack/react-form";
import { TextField } from "./text-field";
import { SubmitButton } from "./submit-button";
import { SelectField } from "./select-field";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    SelectField,
  },
  formComponents: {
    SubmitButton,
  },
});

export { useAppForm };
