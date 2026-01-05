"use server"

import { getPayload } from "payload"
import config from "@/payload.config"
import { cancelOrderForCard, cancelOrderForBankTransfer } from "@order/(page)/list/actions"

type SelectedData = {
  id: number
  user: number
  product: number
  orderCreatedAt: string
  paymentsMethod: string
  pgCno: string | null
  quantity: number
  orderStatus: number
  orderRequest: string
  refundUsedPointAmount: number
  updatedAt: string
  createdAt: string
}


export async function updateOrderStatus(selectedData: SelectedData[]) {
  const payload = await getPayload({ config: config })

  try {
    let totalUserGetPoint = 0
    const userIds = selectedData[0].user;
  
    for (const data of selectedData) {
        const {  product, quantity } = data
        const findProduct = await payload.findByID({
            collection: 'product',
            id: product,
        })
        const userGetPoint = Math.floor(
            (findProduct.cashback_rate_for_bank * quantity * findProduct.price) / 100,
        )
        totalUserGetPoint += userGetPoint
    }
  
    const findUser = await payload.findByID({
        collection: 'users',
        id: userIds,
    })

    await Promise.all([
        ...selectedData.map(async (data) => {
            return payload.update({
                collection: 'order',
                id: data.id,
                data: {
                    orderStatus: 1,
                },
            })
        }),
    ])
  
    await payload.update({
        collection: 'users',
        id: userIds,
        data: {
            point: Number(findUser.point ?? 0) + totalUserGetPoint,
        },
    })
    await payload.create({
        collection: 'point-history',
        data: {
            user: userIds,
            type: 'earn',
            reason: `무통장 입금 완료`,
            balanceAfter: Number(findUser.point ?? 0) + totalUserGetPoint,
        },
    })
  
    return {message: '상품준비 단계로 변경되었습니다.', success: true}
  } catch(error) {
    return {message: '상품준비 단계로 변경에 실패했습니다.', success: false}
  }
}

export async function updateOrderStatusToShipmentStart(selectedData: SelectedData[]) {
  const payload = await getPayload({ config: config })

  try {
    await Promise.all([
      ...selectedData.map(async (data) => {
        return payload.update({
          collection: 'order',
          id: data.id,
          data: {
            orderStatus: 2,
          },
        })
      }),
    ])

    return {message: '배송 시작 단계로 변경되었습니다.', success: true}
  } catch(error) {
    return {message: '배송 시작 단계로 변경에 실패했습니다.', success: false}
  }
}

export async function updateOrderStatusToShipmentComplete(selectedData: SelectedData[]) {
    const payload = await getPayload({ config: config })
  
    try {
      await Promise.all([
        ...selectedData.map(async (data) => {
          return payload.update({
            collection: 'order',
            id: data.id,
            data: {
              orderStatus: 3,
            },
          })
        }),
      ])
  
      return {message: '배송 완료 단계로 변경되었습니다.', success: true}
    } catch(error) {
      return {message: '배송 완료 단계로 변경에 실패했습니다.', success: false}
    }
  }

export async function updateOrderStatusToCancel(selectedData: {bankTransferData: SelectedData[], cardData: SelectedData[]}) {
  const payload = await getPayload({ config: config })
  try {
    // 주문상태 변경
    await Promise.all([
      ...selectedData.bankTransferData.map(async (data) => {
        return payload.update({
          collection: 'order',
          id: data.id,
          data: {
            orderStatus: 4,
          },
        })
      }),
      ...selectedData.cardData.map(async (data) => {
        return payload.update({
          collection: 'order',
          id: data.id,
          data: {
            orderStatus: 4,
          },
        })
      }),
    ])

    // 주문취소 실행 -> 순서대로 실행해야함 (적립문제로 -> Promise.all 사용x)
    for (const data of selectedData.bankTransferData) {
      await cancelOrderForBankTransfer({ orderId: data.id, orderStatus: data.orderStatus })
    }

    for (const data of selectedData.cardData) {
      await cancelOrderForCard({ orderId: data.id })
    }



    return {message: '주문취소 단계로 변경되었습니다.', success: true}
  } catch (error) {
    return {message: '주문취소 단계로 변경에 실패했습니다.', success: false}
  }
}