export const MAX_MOBILE_SCREEN_WIDTH = 580;

export function isMobileSize(sheetHtml: HTMLElement): boolean {
  const sheetWidth = sheetHtml.getBoundingClientRect().width;

  return sheetWidth ? sheetWidth < MAX_MOBILE_SCREEN_WIDTH : false;
}

export function isMobileScreen(): boolean {
  return window.screen.width < MAX_MOBILE_SCREEN_WIDTH;
}

export function parseSheetIdFromHtml(h: HTMLElement): string | null {
  if (h.nodeName === 'FORM') {
    return h.getAttribute('data-sheet-id');
  }

  return h.id.split('-')[2];
}

export function parseCharacterId(s: string): string | null {
  if (s.startsWith('CharacterSheet')) {
    return s.split('-')[2];
  }

  if (s.startsWith('Actor.')) {
    return s.replace('Actor.', '');
  }

  return null;
}
