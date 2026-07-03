import { ControlledProps } from '@/shared/types';
import { Controller, FieldValues } from 'react-hook-form';
import {
  PhoneNumberVerificationInput as BasePhoneNumberVerificationInput,
  PhoneVerificationInputProps as BasePhoneVerificationInputProps,
} from './PhoneVerificationInput';

export type PhoneVerificationInputProps<Form extends FieldValues> = ControlledProps<Form> &
  BasePhoneVerificationInputProps;

export const PhoneVerificationInput = <Form extends FieldValues>(
  props: PhoneVerificationInputProps<Form>,
) => {
  const { name, control, ...restProps } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <BasePhoneNumberVerificationInput {...field} {...restProps} />}
    />
  );
};
