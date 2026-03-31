type sheetFormId = string;

type MobileSheet = {
  mobileViewEnabled: boolean;
  navbarListener?: EventListener;
};

export const mobileSheets = new Map<sheetFormId, MobileSheet>();
