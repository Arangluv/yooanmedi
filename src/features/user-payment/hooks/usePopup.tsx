'use client';

export interface PopupOption {
  width: number;
  height: number;
  left: number;
  top: number;
}

export interface UsePopupProps {
  options?: PopupOption;
}

export const usePopup = (props?: UsePopupProps) => {
  const DEFAULT_WIDTH = 720;
  const DEFAULT_HEIGHT = 800;
  const DEFAULT_POPUP_OPTION: PopupOption = {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    left: window.screen.width / 2 - DEFAULT_WIDTH / 2,
    top: window.screen.height / 2 - DEFAULT_HEIGHT / 2,
  };

  const popupOpen = (url: string) => {
    const popup = window.open(
      url,
      'payment',
      `width=${props?.options?.width || DEFAULT_WIDTH},height=${props?.options?.height || DEFAULT_HEIGHT},left=${props?.options?.left || DEFAULT_POPUP_OPTION.left},top=${props?.options?.top || DEFAULT_POPUP_OPTION.top},resizable=yes,scrollbars=yes`,
    );

    if (!popup) {
      alert('팝업이 차단되었습니다. 팝업차단 해제 후 다시 시도해주세요');
    }
  };

  return { popupOpen };
};
