import { ReactNode, useId } from 'react';
import { FieldWrapper } from '../common/Fields';
import { InputGroup, InputGroupInput, InputGroupAddon } from '../../shadcn/input-group';
import { FieldError } from 'react-hook-form';

export type InputProps = React.ComponentProps<'input'> & {
  label: string;
  isRequired?: boolean;
  error: FieldError | undefined;
  groupContents?: {
    inlineStart?: ReactNode;
    inlineEnd?: ReactNode;
    blockStart?: ReactNode;
    blockEnd?: ReactNode;
  };
};

export const Input = (props: InputProps) => {
  const { id, label, isRequired = false, groupContents, error, ...restProps } = props;
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FieldWrapper inputId={inputId} label={label} error={error} isRequired={isRequired}>
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
