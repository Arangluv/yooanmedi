import { FieldPath, FieldValues, Control } from 'react-hook-form';

export type ControlledProps<Form extends FieldValues> = {
  name: FieldPath<Form>;
  control: Control<Form>;
};
