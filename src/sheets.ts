type CharacterSheetId = string;

type MobileSheet = {
  navbarListener?: EventListener;
};

export const mobileSheets = new Map<CharacterSheetId, MobileSheet>();
