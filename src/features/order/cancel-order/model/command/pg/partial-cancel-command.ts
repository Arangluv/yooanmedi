import { runWithTransaction } from '@/shared/infrastructure';
import { type IPartialCancelCommand } from '../cancel-command';

export class PGPartialCancelCommand implements IPartialCancelCommand {
  // 1. 즉시 취소
  public async run() {
    /**
     * [step] 주문상품 상태 바꾸기 (주문취소)
     * [step] 사용포인트 반환
     * [step] 적립금 반환
     * [step] 결제취소 요청 (easypay)
     * [step] payments history 생성
     * [step] 주문상태 바꾸기
     *  -> 조회
     *  -> 모두 취소인가?, 모두 취소 요청인가?
     *  -> 모두 [취소상태] 라면
     *    - 주문취소
     *  -> 모두 [취소요청 상태] 라면
     *    - 주문취소
     *  -> 하나라도 transition 가능한 상태라면
     *    - currentStatus
     */
  }

  public async execute() {
    return await runWithTransaction(this);
  }
}
