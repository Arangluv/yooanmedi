import { BasePayload, CollectionConfig } from 'payload'

export const Order: CollectionConfig = {
  slug: 'order',
  labels: {
    singular: '주문 내역',
    plural: '주문 내역',
  },
  // access: {
  //   delete: () => false,
  // },
  admin: {
    defaultColumns: ['user', 'product', 'orderStatus', 'orderRequest', 'paymentsMethod'],
    group: '홈페이지 컨텐츠',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      label: '유저',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'product',
      type: 'relationship',
      label: '상품',
      relationTo: 'product',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'orderCreatedAt',
      type: 'date',
      label: '주문일시',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'paymentsMethod',
      type: 'select',
      label: '결제 방법',
      admin: {
        readOnly: true,
      },
      options: [
        {
          label: '신용카드',
          value: 'creditCard',
        },
        {
          label: '무통장입금',
          value: 'bankTransfer',
        },
      ],
      required: true,
    },
    {
      name: 'pgCno',
      type: 'text',
      label: 'PG 주문번호',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'quantity',
      type: 'number',
      label: '수량',
      required: true,
      defaultValue: 1,
      admin: {
        readOnly: true,
      },
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) {
          return true
        }
        if (value < 1) {
          return '수량은 1 이상이어야 합니다.'
        }
        return true
      },
    },
    {
      name: 'orderStatus',
      type: 'relationship',
      label: '주문상태',
      relationTo: 'order-status',
      required: true,
      filterOptions: ({ data, id }) => {
        // 현재 문서의 orderStatus가 결제대기(id: 5)인 경우
        if (!id) {
          return true
        }

        const currentOrderStatus =
          typeof data?.orderStatus === 'number' ? data.orderStatus : data?.orderStatus?.id

        if (currentOrderStatus === 5) {
          // 상품준비(id: 1)만 반환
          return {
            id: {
              equals: 1,
            },
          }
        }

        // 그 외의 경우 모든 옵션 표시
        return true
      },
    },
    {
      name: 'orderRequest',
      type: 'text',
      label: '주문요청사항',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'refundUsedPointAmount',
      type: 'number',
      label: '취소 시 환불 적립금',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation, previousDoc }) => {
        const payload = req.payload as BasePayload
        const { user: userId, product: productId, quantity, paymentsMethod, orderStatus } = doc
        // 결제 방법이 무통장 입금이고, 주문상태가 결제대기 > 상품준비
        if (
          operation === 'update' &&
          paymentsMethod === 'bankTransfer' &&
          previousDoc?.orderStatus === 5 && // 이전 주문 상태가 결제대기
          orderStatus === 1 // 현재 주문 상태가 상품준비
        ) {
          const product = await payload.findByID({
            collection: 'product',
            id: productId,
          })
          const userGetPoint = Math.floor(
            (product.cashback_rate_for_bank * quantity * product.price) / 100,
          )
          const user = await payload.findByID({
            collection: 'users',
            id: userId,
          })
          await payload.update({
            collection: 'users',
            id: userId,
            data: {
              point: Number(user.point ?? 0) + userGetPoint,
            },
            req: { transactionID: req.transactionID as string },
          })
          await payload.create({
            collection: 'point-history',
            data: {
              user: userId,
              type: 'earn',
              reason: `무통장 입금완료`,
              balanceAfter: Number(user.point ?? 0) + userGetPoint,
            },
            req: { transactionID: req.transactionID as string },
          })
        }
      },
      async ({ doc, req, operation, previousDoc }) => {
        const payload = req.payload as BasePayload
        const userId = typeof doc.user === 'number' ? doc.user : doc.user.id
        const productId = typeof doc.product === 'number' ? doc.product : doc.product.id
        const quantity = doc.quantity
        const paymentsMethod = doc.paymentsMethod
        const orderStatus =
          typeof doc.orderStatus === 'number' ? doc.orderStatus : doc.orderStatus.id

        // 결제방법이 무통장, 상품준비단계에서 > 취소단계로 변경시 적립금 차감
        if (
          operation === 'update' &&
          paymentsMethod === 'bankTransfer' &&
          previousDoc?.orderStatus === 1 &&
          orderStatus === 4
        ) {
          const user = await payload.findByID({
            collection: 'users',
            id: userId,
          })
          const product = await payload.findByID({
            collection: 'product',
            id: productId,
          })
          const userGetPoint = Math.floor(
            (product.cashback_rate_for_bank * quantity * product.price) / 100,
          )

          await payload.update({
            collection: 'users',
            id: userId,
            data: {
              point: Number(user.point ?? 0) - userGetPoint,
            },
            req: { transactionID: req.transactionID as string },
          })
          await payload.create({
            collection: 'point-history',
            data: {
              user: user.id,
              type: 'cancel',
              balanceAfter: Number(user.point ?? 0) - userGetPoint,
              reason: `무통장 입금취소`,
            },
            req: { transactionID: req.transactionID as string },
          })
        }
      },
    ],
  },
}
