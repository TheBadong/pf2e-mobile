export const MAX_MOBILE_SCREEN_WIDTH = 580;

export function isMobileSize(sheetHtml: HTMLElement): boolean {
  const sheetWidth = sheetHtml.getBoundingClientRect().width;
  console.debug(sheetHtml, sheetWidth);
  console.debug(
    'returning',
    sheetWidth ? sheetWidth < MAX_MOBILE_SCREEN_WIDTH : false,
  );
  return sheetWidth ? sheetWidth < MAX_MOBILE_SCREEN_WIDTH : false;
}
