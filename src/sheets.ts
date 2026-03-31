type sheetFormId = string;

export type MobileSheet = {
  mobileViewEnabled: boolean;
  navbarListener?: EventListener;
  resizeObserver?: ResizeObserver;
};

export const mobileSheets = new Map<sheetFormId, MobileSheet>();
