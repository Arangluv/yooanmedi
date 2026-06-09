import { BaseError } from '@/shared';

export const POINT_FEATURE_ERROR_MESSAGE = {
  invalidData: '잘못된 포인트 데이터입니다',
  createUsage: '포인트 사용 / 적립내역을 생성하는데 문제가 발생했습니다',
  createRefund: '포인트 환불 / 환수내역을 생성하는데 문제가 발생했습니다',
  update: '유저 포인트를 업데이트하는데 문제가 발생했습니다',
};

export class PointFeatureError extends BaseError {
  static create(message: string) {
    return new BaseError({ clientMsg: message, errorName: 'PointFeatureCreateError' });
  }

  static update(message: string = POINT_FEATURE_ERROR_MESSAGE.update) {
    return new BaseError({ clientMsg: message, errorName: 'PointFeatureCreateError' });
  }
}
