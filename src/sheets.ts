type SheetFormId = string;

export type SheetDomData = {
  mobileViewEnabled: boolean;
  navbarListener?: EventListener;
  resizeObserver?: ResizeObserver;
};

export const domSheets = new Map<SheetFormId, SheetDomData>();
