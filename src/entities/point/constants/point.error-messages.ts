const spacer = ' ';
const prefix = spacer + '과정에서 문제가 발생했습니다';

export const POINT_TRANSACTION_ERROR_MESSAGE = {
  create: '포인트 적립/사용 내역을 생성하는' + prefix,
  createUseHistory: '포인트 사용 내역을 생성하는' + prefix,
  createEarnHistory: '포인트 적립 내역을 생성하는' + prefix,
  createCancelUseHistory: '포인트 사용취소 내역을 생성하는' + prefix,
  createCancelEarnHistory: '포인트 적립취소 내역을 생성하는' + prefix,
  findHistory: '포인트 내역을 조회하는' + prefix,
  updatePoint: '포인트 내역을 업데이트' + prefix,
  findUser: '유저를 조회하는' + prefix,
  mapper: {
    productToPointItem: '상품을 적립포인트 아이템으로 바꾸는' + prefix,
    cartItemListToPointItemList: '장바구니 리스트를 적립포인트 아이템으로 바꾸는' + prefix,
  },
};
