import { UserRepository } from '../infrastructure';
import { type User } from './schemas/user.schema';

export class UserService {
  public async getUserMap(userIds: number[]): Promise<Map<number, User>> {
    const users = await UserRepository.findMany(userIds);
    const userMap = new Map<number, User>();

    users.forEach((user) => {
      userMap.set(user.id, user);
    });
    return userMap;
  }
}
