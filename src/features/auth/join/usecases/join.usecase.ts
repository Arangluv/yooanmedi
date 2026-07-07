import { CreateClientRequestDto, User } from '@/entities/user';
import { CheckDuplicatedFieldResultDto, JoinUniqueCheckFieldDto } from '../types';

export interface JoinUseCase {
  clientJoin: (dto: CreateClientRequestDto) => Promise<User>;
  checkDuplicateFileds: (
    data: JoinUniqueCheckFieldDto[],
  ) => Promise<CheckDuplicatedFieldResultDto[]>;
}
