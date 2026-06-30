import { ReactNode } from 'react';
import { InputGroup, InputGroupInput, InputGroupAddon } from '../../shadcn/input-group';

export type InputProps = React.ComponentProps<'input'> & {
  groupContents?: {
    inlineStart?: ReactNode;
    inlineEnd?: ReactNode;
    blockStart?: ReactNode;
    blockEnd?: ReactNode;
  };
};

export const Input = ({ groupContents, ...restProps }: InputProps) => {
  return (
    <InputGroup>
      <InputGroupInput {...restProps} />
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
  );
};
