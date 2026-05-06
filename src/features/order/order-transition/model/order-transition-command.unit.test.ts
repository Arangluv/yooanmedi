import { describe, it, expect, vi } from 'vitest';
import { OrderTransitionCommandFactory } from './order-transition-command-factory';
import { createOrderFixture } from '@/entities/order';

describe('OrderTransitionCommand', () => {
  it('execute 성공 시 주문상태 변경과 관련된 모든 액션이 실행된다', async () => {
    const command = OrderTransitionCommandFactory.createCommand(createOrderFixture());
    expect(() => command.execute()).not.toThrow();
  });

  it('execute 실패 시 에러를 throw한다.', async () => {
    const command = OrderTransitionCommandFactory.createCommand(createOrderFixture());
    vi.spyOn(command, 'execute').mockRejectedValue(() => {
      throw new Error('execute fail');
    });

    await expect(() => command.execute()).rejects.toThrowError();
  });
});
