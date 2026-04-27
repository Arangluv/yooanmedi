import { getUserByHeader } from './get-user-by-header';
import { getUserById } from './get-user-by-id';
import { zodSafeParse } from '@/shared';
import { userSchema } from '../model/schemas/user.schema';

export class UserRepository {
  // TODO :: 주석부분 고민해보기
  public static async findByHeader() {
    const user = await getUserByHeader();
    return zodSafeParse(userSchema, user);
    // --> getUserByHeader는 User & {collection: "users"} 혹은 null을 return한다
  }

  public static async findById(id: number) {
    const user = await getUserById(id);
    return zodSafeParse(userSchema, user);
    // --> 유저를 찾지 못하면 getUserById단에서 NotFound error를 throw한다 그래서 둘이 다루는 로직이 다르다
  }
}
