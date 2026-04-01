import { handleCharacterNavigation } from './navigation-management';
import { handleMobileSidebar, restoreSidebarToMain } from './sidebar-mangement';
import './styles/index.scss';
import { handleScroll, restoreDefaultActive } from './scroll-management';
import { isMobileScreen, isMobileSize, parseCharacterId } from './utils';
import { domSheets, type SheetDomData } from './sheets';

Hooks.once('init', () => {
  console.debug('pf2e mobile starts');
  console.debug('Initiating MobileSheets');
});

/**
 * Add a new button that displays the sidebar information in a dedicated page
 */
Hooks.on('renderCharacterSheetPF2e', async (_app, html, _data) => {
  const characterId = parseCharacterId(_data.document.uuid);
  if (!characterId) {
    console.error(
      'Could not parse character id. Skipping mobile sheet rendering',
    );
    return;
  }

  // Get sheet dom elements
  let characterSheet, sheetForm, isFormUpdate;
  try {
    ({ characterSheet, sheetForm, isFormUpdate } = parseRenderedHtml(
      html,
      characterId,
    ));
  } catch (e) {
    console.error('Could not parse sheet html. Skipping mobile rendering.', e);
    return;
  }

  sheetForm.setAttribute('data-sheet-id', characterId);
  console.debug('Registering Mobile Sheet ', characterId);

  let mobileSheet = domSheets.get(
    sheetForm.getAttribute('data-sheet-id') as string,
  );

  let isMobileView = false;

  if (mobileSheet) {
    isMobileView = mobileSheet.mobileViewEnabled;
  } else {
    isMobileView = isMobileScreen() || isMobileSize(sheetForm);
    domSheets.set(characterId, { mobileViewEnabled: false });
  }

  mobileSheet = domSheets.get(
    sheetForm.getAttribute('data-sheet-id') as string,
  ) as SheetDomData;

  if (isMobileView) {
    domSheets.set(characterId, { mobileViewEnabled: true });
    enableMobileView(sheetForm);
  }

  const observer = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const resizedSheetForm = entry.target.querySelector(
        'form.crb-style',
      ) as HTMLElement | null;
      const resizedCharacterId = parseCharacterId(characterSheet.id);
      if (!resizedSheetForm || !resizedCharacterId) {
        console.error('Could not find sheet Id, skipping mobile prcessing.', {
          resizedSheetForm,
          resizedCharacterId,
        });
        return;
      }

      const mobileSheet = domSheets.get(characterId);

      if (!mobileSheet) return;

      if (!mobileSheet.mobileViewEnabled && isMobileSize(resizedSheetForm)) {
        mobileSheet.mobileViewEnabled = true;
        enableMobileView(resizedSheetForm);
        return;
      }

      if (mobileSheet.mobileViewEnabled && !isMobileSize(resizedSheetForm)) {
        mobileSheet.mobileViewEnabled = false;
        deactivateMobileView(resizedSheetForm);
        return;
      }
    });
  });

  mobileSheet.resizeObserver = observer;

  if (isFormUpdate) {
    console.info('Do not reobserve on re-renders');
  }
  mobileSheet.resizeObserver.observe(characterSheet);
});

function enableMobileView(sheetForm: HTMLElement): void {
  console.debug('Enabling mobile view');
  handleMobileSidebar(sheetForm);
  handleCharacterNavigation(sheetForm);
  handleScroll(sheetForm);
  sheetForm.classList.add('mobile-character-sheet');
}

function deactivateMobileView(sheetForm: HTMLElement): void {
  console.debug('disabling mobile view');
  restoreSidebarToMain(sheetForm);
  restoreDefaultActive(sheetForm);
  // Remove navbarlistener
  const mobileSheet = domSheets.get(
    sheetForm.getAttribute('data-sheet-id') as string,
  );
  if (mobileSheet) {
    sheetForm
      .querySelector('nav.sheet-navigation')
      ?.removeEventListener(
        'click',
        mobileSheet?.navbarListener as EventListener,
        { capture: true },
      );
    mobileSheet.navbarListener = undefined;
  }

  sheetForm.classList.remove('mobile-character-sheet');
}

/**
 * Parse the Character Sheet and the Sheet Form.
 *
 * @param renderedHtml The raw HTML passed to the Hook
 * @param characterId The character id used to identify the Sheet
 *
 * @throws If no sheet nor form can be parsed
 */
function parseRenderedHtml(
  renderedHtml: JQuery<HTMLElement>,
  characterId: string,
): {
  characterSheet: HTMLElement;
  sheetForm: HTMLElement;
  isFormUpdate: boolean; // Might not need this
} {
  const parsedHtml = renderedHtml.get(0) as HTMLElement | null;
  let characterSheet;
  let sheetForm;
  let isFormUpdate = false;

  if (
    parsedHtml?.id.startsWith('CharacterSheet') &&
    parsedHtml?.nodeName !== 'FORM'
  ) {
    characterSheet = parsedHtml;
    sheetForm = parsedHtml.querySelector(
      'form.crb-style',
    ) as HTMLElement | null;
  }

  if (parsedHtml?.nodeName === 'FORM') {
    characterSheet = document.querySelector(
      `#CharacterSheetPF2e-Actor-${characterId}`,
    ) as HTMLElement | null;
    sheetForm = parsedHtml;
    isFormUpdate = true;
  }

  if (!parsedHtml || !characterSheet || !sheetForm)
    throw new Error('Unable to parse character sheet or form.');

  return {
    characterSheet,
    sheetForm,
    isFormUpdate,
  };
}
