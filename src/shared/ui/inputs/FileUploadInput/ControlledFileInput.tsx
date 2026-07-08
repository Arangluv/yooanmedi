import { ControlledProps } from '@/shared/types';
import { Controller, FieldValues } from 'react-hook-form';
import {
  FileUploadInput as BaseFileUploadInput,
  FileUploadInputProps as BaseFileUploadInputProps,
} from './FileUploadInput';
import React from 'react';

export type FileUploadInputProps<Form extends FieldValues> = ControlledProps<Form> &
  Omit<BaseFileUploadInputProps, 'onChange' | 'value'>;

export const FileUploadInput = <Form extends FieldValues>(props: FileUploadInputProps<Form>) => {
  const { name, control, ...restProps } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <BaseFileUploadInput {...field} {...restProps} />}
    />
  );
};
