'use client';

import * as XLSX from 'xlsx-js-style';
import moment from 'moment';

import SharedExcelExportButton from '@/shared/ui/ExcelExportButton';
import type { OrderListItem } from '../lib/normalization';

type ExcelExportData = {
  번호: number;
  주문일시: string;
  제조사: string;
  상품명: string;
  보험코드: string;
  가격: number;
  주문수량: number;
  총금액: number;
};

const ExcelExportButton = ({ data }: { data: OrderListItem[] }) => {
  const handleExcelExport = () => {
    const workbook = XLSX.utils.book_new();

    const exportData: ExcelExportData[] = [];
    let indexCount = 1;

    data.forEach((order) => {
      order.orderProducts.forEach((orderProduct) => {
        const willPushData = {
          번호: indexCount,
          주문일시: moment(order.createdAt).format('YYYY-MM-DD'),
          제조사: orderProduct.product.manufacturer,
          상품명: orderProduct.productNameSnapshot,
          보험코드: orderProduct.product.insurance_code ?? '',
          가격: orderProduct.priceSnapshot,
          주문수량: orderProduct.quantity,
          총금액: orderProduct.priceSnapshot * orderProduct.quantity,
        };

        exportData.push(willPushData);
        indexCount++;
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // 한글 문자 너비 계산 함수 (한글은 대략 2배 너비)
    const calculateWidth = (str: string): number => {
      if (!str) return 0;
      let width = 0;

      for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const charCode = char.charCodeAt(0);
        // 한글 범위: 가-힣 (0xAC00-0xD7A3), 한글 자모 등
        if (
          (charCode >= 0xac00 && charCode <= 0xd7a3) ||
          (charCode >= 0x1100 && charCode <= 0x11ff) ||
          (charCode >= 0x3130 && charCode <= 0x318f)
        ) {
          width += 2; // 한글은 2배 너비
        } else {
          width += 1; // 영문, 숫자 등은 1배 너비
        }
      }
      return width;
    };

    // 헤더 중앙 정렬
    const range = XLSX.utils.decode_range(worksheet['!ref']!);

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C }); // r:0 = 헤더 row
      const cell = worksheet[cellAddress];

      if (cell) {
        cell.s = {
          alignment: {
            horizontal: 'center',
            vertical: 'center',
          },
          font: {
            bold: true, // (선택) 보통 헤더는 bold 같이 씀
          },
        };
      }
    }

    // 특정 컬럼 데이터 중앙정렬
    const centerAlignColumns = [0, 1, 4, 6]; // 번호, 보험코드, 주문수량

    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      centerAlignColumns.forEach((C) => {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];

        if (cell) {
          cell.s = {
            ...(cell.s ?? {}),
            alignment: {
              horizontal: 'center',
              vertical: 'center',
            },
          };
        }
      });
    }

    // 데이터를 기반으로 동적으로 열 너비 계산
    const keys = Object.keys(exportData[0] || {});
    const columnWidths = keys.map((key) => {
      const headerWidth = calculateWidth(key);
      const maxDataWidth = Math.max(
        ...exportData.map((row) => {
          const value = row[key as keyof typeof row];
          return value ? calculateWidth(String(value)) : 0;
        }),
      );
      const maxWidth = Math.max(headerWidth, maxDataWidth);
      return { wch: Math.max(maxWidth + 3, 10) }; // 여유 공간 3 추가, 최소 10
    });

    worksheet['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'order_list');
    XLSX.writeFile(workbook, '주문내역.xlsx');
  };

  return <SharedExcelExportButton onClick={handleExcelExport} />;
};

export default ExcelExportButton;
