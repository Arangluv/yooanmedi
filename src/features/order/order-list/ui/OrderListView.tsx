'use client';

import { Divider } from '@heroui/react';

import OrderListTitle from './OrderListTitle';
import OrderListSearch from './OrderListSearch';
import OrderList from './OrderList';

import type { OrderListItem } from '../lib/normalization';

const OrderListView = ({ orderList }: { orderList: OrderListItem[] }) => {
  return (
    <div className="flex min-h-[calc(100vh-415px)] w-full justify-center">
      <div className="flex w-5xl flex-col gap-4">
        <OrderListTitle />
        <Divider />
        <OrderListSearch />
        <OrderList orderList={orderList} />
      </div>
    </div>
  );
};

// export default function OrderListExportButton({ data }: { data: OrderListType[] }) {
//   const handleExport = () => {
//     const workbook = xlsx.utils.book_new()
//     const exportData = data.map((item, index) => ({
//       번호: index + 1,
//       주문일시: moment(item.orderCreatedAt).format('YYYY-MM-DD'),
//       제조사: item.product.manufacturer,
//       상품명: item.product.name,
//       가격: item.price,
//       주문수량: item.quantity,
//       총금액: item.price * item.quantity,
//     }))

//     const worksheet = xlsx.utils.json_to_sheet(exportData)

//     // 한글 문자 너비 계산 함수 (한글은 대략 2배 너비)
//     const calculateWidth = (str: string): number => {
//       if (!str) return 0
//       let width = 0
//       for (let i = 0; i < str.length; i++) {
//         const char = str[i]
//         const charCode = char.charCodeAt(0)
//         // 한글 범위: 가-힣 (0xAC00-0xD7A3), 한글 자모 등
//         if (
//           (charCode >= 0xac00 && charCode <= 0xd7a3) ||
//           (charCode >= 0x1100 && charCode <= 0x11ff) ||
//           (charCode >= 0x3130 && charCode <= 0x318f)
//         ) {
//           width += 2 // 한글은 2배 너비
//         } else {
//           width += 1 // 영문, 숫자 등은 1배 너비
//         }
//       }
//       return width
//     }

//     // 데이터를 기반으로 동적으로 열 너비 계산
//     const keys = Object.keys(exportData[0] || {})
//     const columnWidths = keys.map((key) => {
//       const headerWidth = calculateWidth(key)
//       const maxDataWidth = Math.max(
//         ...exportData.map((row) => {
//           const value = row[key as keyof typeof row]
//           return value ? calculateWidth(String(value)) : 0
//         }),
//       )
//       const maxWidth = Math.max(headerWidth, maxDataWidth)
//       return { wch: Math.max(maxWidth + 3, 10) } // 여유 공간 3 추가, 최소 10
//     })

//     worksheet['!cols'] = columnWidths

//     xlsx.utils.book_append_sheet(workbook, worksheet, 'order_list')
//     xlsx.writeFile(workbook, '주문내역.xlsx')
//   }

//   return (
//     <div>
//       <Button
//         className="bg-[#257449] text-white rounded-md text-xs !w-fit !max-w-fit !py-1 !px-2"
//         size="sm"
//         radius="sm"
//         onPress={handleExport}
//       >
//         <span>엑셀 다운로드</span>
//       </Button>
//     </div>
//   )
// }

export default OrderListView;
