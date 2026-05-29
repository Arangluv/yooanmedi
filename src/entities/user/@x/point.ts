import type { User as UserEntity } from '../types';

export interface User extends Pick<UserEntity, 'id' | 'point'> {}
