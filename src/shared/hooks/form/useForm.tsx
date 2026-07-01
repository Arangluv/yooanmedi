import { useForm as useBaseForm, UseFormProps, FieldValues } from 'react-hook-form';

export type FormSubmitHandler<FormData extends FieldValues> = (
  data: FormData,
) => void | Promise<void>;

type Parameters<Form extends FieldValues> = UseFormProps<Form> & {
  onSubmit: FormSubmitHandler<Form>;
};

export function useForm<Form extends FieldValues>(parameters: Parameters<Form>) {
  const { onSubmit } = parameters;
  const baseForm = useBaseForm<Form>(parameters);
  const { formState, reset, setError, handleSubmit, ...restProps } = baseForm;
  const { errors } = formState;

  return {
    ...restProps,
    formState,
    reset,
    errors,
    setError,
    handleSubmit,
    onSubmit: handleSubmit((data) => onSubmit(data)),
  };
}
