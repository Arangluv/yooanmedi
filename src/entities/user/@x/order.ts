import type { User as UserEntity } from '../model/type';

export interface User extends Pick<UserEntity, 'id'> {}
