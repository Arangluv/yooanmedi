'use client';

import { useEffect } from 'react';

const OrderListTableBehavior = () => {
  useEffect(() => {
    // 추후 모드에 따른 분기 구현
    // const mode = 'test';

    const headingCheckboxEl = document.getElementById('heading-_select');
    const cellCheckboxEl = document.querySelectorAll('.cell-_select');

    if (headingCheckboxEl && cellCheckboxEl) {
      headingCheckboxEl.style.display = 'none';
      cellCheckboxEl.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
    }
  }, []);

  return <div />;
};

export default OrderListTableBehavior;
