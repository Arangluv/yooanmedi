import { Wrapper } from './Wrapper';
import { LoadingSpinner } from '../LoadingSpinner';

export type BloackingLoaderProps = { isLoading: boolean };

export const BloackingLoader = ({ isLoading }: BloackingLoaderProps) => {
  return (
    <Wrapper isLoading={isLoading}>
      <LoadingSpinner></LoadingSpinner>
    </Wrapper>
  );
};
