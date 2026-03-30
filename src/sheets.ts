type CharacterSheetId = string;

type MobileSheet = {
  mobileViewEnabled: boolean;
  navbarListener?: EventListener;
};

export const mobileSheets = new Map<CharacterSheetId, MobileSheet>();
