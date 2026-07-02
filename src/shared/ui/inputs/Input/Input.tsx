import { ReactNode, useId } from 'react';
import { FieldWrapperProps, FieldWrapper } from '../common';
import { InputGroup, InputGroupInput, InputGroupAddon } from '../../shadcn/input-group';

export type InputProps = React.ComponentProps<'input'> & {
  groupContents?: {
    inlineStart?: ReactNode;
    inlineEnd?: ReactNode;
    blockStart?: ReactNode;
    blockEnd?: ReactNode;
  };
} & Omit<FieldWrapperProps, 'inputId' | 'children'>;

export const Input = (props: InputProps) => {
  const { id, isRequired = false, groupContents, ...restProps } = props;
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FieldWrapper inputId={inputId} isRequired={isRequired} {...restProps}>
      <InputGroup>
        <InputGroupInput id={inputId} {...restProps} />
        {groupContents?.inlineStart && (
          <InputGroupAddon align="inline-start">{groupContents.inlineStart}</InputGroupAddon>
        )}
        {groupContents?.inlineEnd && (
          <InputGroupAddon align="inline-end">{groupContents.inlineEnd}</InputGroupAddon>
        )}
        {groupContents?.blockStart && (
          <InputGroupAddon align="block-start">{groupContents.blockStart}</InputGroupAddon>
        )}
        {groupContents?.blockEnd && (
          <InputGroupAddon align="block-end">{groupContents.blockEnd}</InputGroupAddon>
        )}
      </InputGroup>
    </FieldWrapper>
  );
};
