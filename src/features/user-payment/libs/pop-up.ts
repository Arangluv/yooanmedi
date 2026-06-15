'use client';

const DEFAULT_WIDTH = 720;
const DEFAULT_HEIGHT = 800;
const DEFAULT_POPUP_OPTION: PopupManagerOption = {
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  left: window.screen.width / 2 - DEFAULT_WIDTH / 2,
  top: window.screen.height / 2 - DEFAULT_HEIGHT / 2,
};

export interface PopupManagerOption {
  width: number;
  height: number;
  left: number;
  top: number;
}

export class PopupManager {
  private options: {
    width: number;
    height: number;
    left: number;
    top: number;
  };
  private url: string;

  constructor(url: string, option: PopupManagerOption = DEFAULT_POPUP_OPTION) {
    this.url = url;
    this.options = option;
  }

  open() {
    const popup = window.open(
      this.url,
      'payment',
      `width=${this.options.width},height=${this.options.height},left=${this.options.left},top=${this.options.top},resizable=yes,scrollbars=yes`,
    );

    if (!popup) {
      alert('팝업이 차단되었습니다. 팝업차단 해제 후 다시 시도해주세요');
    }
  }
}
