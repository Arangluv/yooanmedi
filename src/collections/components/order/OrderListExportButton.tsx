'use client';

import * as XLSX from 'xlsx-js-style'; // xlsx 대신 xlsx-js-style 사용
import moment from 'moment-timezone';

export default function OrderListExportButton({ data }: { data: any[] }) {
  const handleExport = () => {
    const workbook = XLSX.utils.book_new();
    const exportData = data.map((item, index) => ({
      번호: index + 1,
      '주문 일시': moment(item.orderCreatedAt).format('YYYY-MM-DD'),
      상호명: item.user.hospitalName,
      상품명: item.product.name,
      '상품 가격': item.price,
      '보험 코드': item.product.insurance_code,
      규격: item.product.specification,
      '결제 방법': item.paymentsMethod === 'creditCard' ? '신용카드' : '무통장입금',
      '주문 수량': item.quantity,
      '주문 상태': item.orderStatus.name,
      '주문 요청사항': item.orderRequest,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // 컬럼 너비 설정
    worksheet['!cols'] = [
      { wch: 8 }, // 번호
      { wch: 12 }, // 주문 일시
      { wch: 20 }, // 상호명 (넓게)
      { wch: 30 }, // 상품명 (넓게)
      { wch: 12 }, // 상품 가격
      { wch: 20 }, // 보험 코드 (넓게)
      { wch: 20 }, // 규격 (넓게)
      { wch: 12 }, // 결제 방법
      { wch: 10 }, // 주문 수량
      { wch: 12 }, // 주문 상태
      { wch: 25 }, // 주문 요청사항
    ];

    // 가운데 정렬할 컬럼 인덱스 (상호명, 상품명, 규격, 결제방법, 주문상태, 요청사항)
    const centerAlignColumns = [2, 3, 6, 7, 9, 10]; // 컬럼 인덱스: 상호명(2), 상품명(3), 규격(6), 결제방법(7), 주문상태(9), 요청사항(10)

    // 모든 셀에 정렬 적용
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!worksheet[cellAddress]) continue;

        // 헤더 행(첫 번째 행)은 항상 가운데 정렬
        const isHeaderRow = row === range.s.r;
        // 데이터 행은 컬럼 인덱스에 따라 정렬 결정
        const isCenterAlign = isHeaderRow || centerAlignColumns.includes(col);

        worksheet[cellAddress].s = {
          font: {
            name: '맑은 고딕',
            sz: 12,
          },
          alignment: {
            horizontal: isCenterAlign ? 'center' : 'right',
            vertical: 'center',
          },
        };
      }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, 'order_list');
    XLSX.writeFile(workbook, `${moment().tz('Asia/Seoul').format('YYYYMMDDHHmmss')}_주문내역.xlsx`);
  };

  return (
    <div>
      <button
        className="cursor-pointer rounded-md bg-[#257449] px-3 py-1 text-white"
        onClick={handleExport}
      >
        엑셀 다운로드
      </button>
    </div>
  );
}
