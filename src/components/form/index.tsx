import { createFormHookContexts, createFormHook } from "@tanstack/react-form";
import { TextField } from "./text-field";
import { SubmitButton } from "./submit-button";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubmitButton,
  },
});

export { useAppForm };
