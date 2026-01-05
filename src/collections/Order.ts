import { APIError, BasePayload, CollectionConfig, SanitizedCollectionConfig, RequestContext, PayloadRequest } from 'payload'
import {cancelOrderForCard, cancelOrderForBankTransferForHooks} from "@order/(page)/list/actions"

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
    defaultColumns: ['user', 'product', 'orderStatus',"quantity", 'orderRequest', 'paymentsMethod', "orderCreatedAt"],
    group: '홈페이지 컨텐츠',
    components: {
      beforeListTable: ["@/collections/components/order/OrderComponents"]
    }
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      label: '유저',
      relationTo: 'users',
      required: true,
      admin: {
        disableBulkEdit: true,
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
        disableBulkEdit: true,
        readOnly: true,
      },
    },
    {
      name: 'orderCreatedAt',
      type: 'date',
      label: '주문일시',
      required: true,
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
    },
    {
      name: 'paymentsMethod',
      type: 'select',
      label: '결제 방법',
      admin: {
        disableBulkEdit: true,
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
        disableBulkEdit: true,
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
        disableBulkEdit: true,
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
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
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
        disableBulkEdit: true,
        readOnly: true,
      },
    },
    {
      name: 'refundUsedPointAmount',
      type: 'number',
      label: '취소 시 환불 적립금',
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
    },
  ],
  hooks: {
    // afterChange: [
    //   async ({ doc, req, operation, previousDoc, data, context }) => {
    //     // 결제 방법이 무통장 입금이고, 주문상태가 결제대기 > 상품준비
    //     try {
    //       const payload = req.payload as BasePayload
    //       const userId = typeof doc.user === 'number' ? doc.user : doc.user.id
    //       const productId = typeof doc.product === 'number' ? doc.product : doc.product.id
    //       const quantity = doc.quantity
    //       const paymentsMethod = doc.paymentsMethod
    //       const orderStatus =
    //         typeof doc.orderStatus === 'number' ? doc.orderStatus : doc.orderStatus.id

    //         // 결제방법이 무통장, 상품준비단계에서 > 취소단계로 변경시 적립금 차감
    //         if (
    //           operation === 'update' &&
    //           paymentsMethod === 'bankTransfer' &&
    //           previousDoc?.orderStatus === 5 && // 이전 주문 상태가 결제대기
    //           orderStatus === 1 // 현재 주문 상태가 상품준비
    //         ) {
    //         const product = await payload.findByID({
    //           collection: 'product',
    //           id: productId,
    //         })
            
    //         const userGetPoint = Math.floor(
    //           (product.cashback_rate_for_bank * quantity * product.price) / 100,
    //         )

    //         const user = await payload.findByID({
    //           collection: 'users',
    //           id: userId,
    //         })

    //         await payload.update({
    //           collection: 'users',
    //           id: userId,
    //           data: {
    //             point: Number(user.point ?? 0) + userGetPoint,
    //           },
    //         })

    //         await payload.create({
    //           collection: 'point-history',
    //           data: {
    //             user: userId,
    //             type: 'earn',
    //             reason: `무통장 입금완료`,
    //             balanceAfter: Number(user.point ?? 0) + userGetPoint,
    //           },
    //         })
    //       }
    //     } catch (error) {
    //       console.log(error)
    //     }
    //   },
    // ],
    beforeOperation: [
      ({context,args, operation, req}) => {
        if (operation === 'read' && req?.user?.role === 'admin' && args.where) {
       // 구조: { and: [ { or: [ { and: [...] }, { and: [...] } ] } ] }
          // 이를 { and: [...] } 형태로 변환
          
          const allConditions: any[] = []
          
          // 기존 and 배열의 다른 항목들 처리 (or가 아닌 것들)
          if (args.where.and && Array.isArray(args.where.and)) {
            args.where.and.forEach((andItem: any) => {
              if (andItem.or && Array.isArray(andItem.or)) {
                // or 배열의 각 항목에서 and 조건들을 추출
                andItem.or.forEach((orItem: any) => {
                  if (orItem.and && Array.isArray(orItem.and)) {
                    // 각 and 배열의 조건들을 평탄화하여 추가
                    orItem.and.forEach((condition: any) => {
                      allConditions.push(condition)
                    })
                  } else if (orItem) {
                    // and가 없으면 직접 조건으로 추가
                    allConditions.push(orItem)
                  }
                })
              } else if (andItem) {
                // or가 아닌 일반 조건은 그대로 추가
                allConditions.push(andItem)
              }
            })
          }
          
          // 변환된 where 절 적용
          args.where = {
            and: allConditions
          }
        }
        return args
      }
    ]
  },
}
