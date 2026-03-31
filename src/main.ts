import { handleCharacterNavigation } from './navigation-management';
import { handleMobileSidebar, restoreSidebarToMain } from './sidebar-mangement';
import './styles/index.scss';
import { handleScroll, restoreDefaultActive } from './scroll-management';
import { isMobileScreen, isMobileSize, parseSheetId } from './utils';
import { mobileSheets, type MobileSheet } from './sheets';

Hooks.once('init', () => {
  console.debug('pf2e mobile starts');
  console.debug('Initiating MobileSheets');
});

/**
 * Add a new button that displays the sidebar information in a dedicated page
 */
Hooks.on('renderCharacterSheetPF2e', async (_app, html, _data) => {
  let skipRenderCount = 2;
  // TODO: WARNING
  // For intial render, html is the whole sheetForm div
  // On re-renders, html if the sheetForm FORM
  // The Form encapsulates everything, so it shouldn't be a problem. Just a tiny refactor should do.
  // This project doesn't neeed anything that's outside the form
  // Except maybe the id.
  // Fuck ?
  // Maybe we can get it in _app or _data

  const parsedHtml = html.get(0) as HTMLElement;
  // Always work with the form
  let sheetForm = parsedHtml;

  if (
    parsedHtml.id.startsWith('CharacterSheetPF2e-Actor') &&
    parsedHtml.nodeName !== 'form'
  ) {
    sheetForm = parsedHtml.querySelector(
      '.window-content > form',
    ) as HTMLElement;
  }

  const sheetFormId = parseSheetId(_data.document.uuid);
  if (!sheetFormId) {
    console.error('Could not init sheet form id. Skipping mobile processing');
    return;
  }

  sheetForm.setAttribute('data-sheet-id', sheetFormId);

  console.debug('Registering Mobile Sheet ', sheetFormId, sheetForm);

  let mobileSheet = mobileSheets.get(
    sheetForm.getAttribute('data-sheet-id') as string,
  );

  let isMobileView = false;

  if (mobileSheet) {
    mobileSheet.resizeObserver?.disconnect();
    isMobileView = mobileSheet.mobileViewEnabled;
  } else {
    isMobileView = isMobileScreen() || isMobileSize(sheetForm);
    mobileSheets.set(sheetFormId, { mobileViewEnabled: false });
  }

  mobileSheet = mobileSheets.get(
    sheetForm.getAttribute('data-sheet-id') as string,
  ) as MobileSheet;

  if (isMobileView) {
    mobileSheets.set(sheetFormId, { mobileViewEnabled: true });
    enableMobileView(sheetForm);
  }

  const observer = new ResizeObserver((entries) => {
    if (skipRenderCount) {
      skipRenderCount -= 1;
      return;
    }

    entries.forEach((entry) => {
      const targetForm = entry.target as HTMLElement;
      const targetId = targetForm.getAttribute('data-sheet-id') as string;
      if (!targetId) {
        console.error('Could not find sheet Id, skipping mobile prcessing.');
        return;
      }

      const mobileSheet = mobileSheets.get(targetId);

      if (!mobileSheet) return;

      if (!mobileSheet.mobileViewEnabled && isMobileSize(targetForm)) {
        mobileSheet.mobileViewEnabled = true;
        enableMobileView(targetForm);
        return;
      }

      if (mobileSheet.mobileViewEnabled && !isMobileSize(targetForm)) {
        mobileSheet.mobileViewEnabled = false;
        deactivateMobileView(sheetForm);
        return;
      }
    });
  });

  mobileSheet.resizeObserver = observer;

  mobileSheet.resizeObserver.observe(sheetForm);
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
  const mobileSheet = mobileSheets.get(
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
