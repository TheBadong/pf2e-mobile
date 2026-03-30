export const MAX_MOBILE_SCREEN_WIDTH = 580;

export function isMobileSize(sheetHtml: HTMLElement): boolean {
  const sheetWidth = sheetHtml.getBoundingClientRect().width;

  return sheetWidth ? sheetWidth < MAX_MOBILE_SCREEN_WIDTH : false;
}

export function isMobileScreen(): boolean {
  return window.screen.width < MAX_MOBILE_SCREEN_WIDTH;
}
