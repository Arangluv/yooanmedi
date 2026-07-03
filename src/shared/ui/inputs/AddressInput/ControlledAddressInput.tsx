import { Controller, FieldValues } from 'react-hook-form';
import {
  AddressInput as BaseAddressInput,
  AddressInputProps as BaseAddressInputProps,
} from './AddressInput';
import { ControlledProps } from '@/shared/types';

export type AddressInputProps<Form extends FieldValues> = ControlledProps<Form> &
  BaseAddressInputProps;

export const AddressInput = <Form extends FieldValues>(props: AddressInputProps<Form>) => {
  const { name, control, ...restProps } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <BaseAddressInput {...field} {...restProps} />}
    />
  );
};
