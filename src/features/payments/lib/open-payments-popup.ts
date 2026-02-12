'use client';

export const openPaymentsPopup = (authPageUrl: string) => {
  if (!authPageUrl) {
    alert('결제 주문 등록 실패');
    return;
  }

  const width = 600;
  const height = 680;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  const popup = window.open(
    authPageUrl,
    'payment',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
  );

  if (!popup) {
    alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
    return;
  }
};
