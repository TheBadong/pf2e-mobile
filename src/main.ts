import { handleCharacterNavigation } from './navigation-management';
import { handleMobileSidebar, restoreSidebarToMain } from './sidebar-mangement';
import './styles/index.scss';
import { handleScroll, restoreDefaultActive } from './scroll-management';
import { isMobileScreen, isMobileSize } from './utils';
import { mobileSheets } from './sheets';

Hooks.once('init', () => {
  console.debug('pf2e mobile starts');
  console.debug('Initiating MobileSheets');
});

/**
 * Add a new button that displays the sidebar information in a dedicated page
 */
Hooks.on('renderCharacterSheetPF2e', async (_app, html, _data) => {
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
  let sheetForm = html.get(0) as HTMLElement;
  if (
    parsedHtml.id.startsWith('sheetFormPF2e-Actor') &&
    parsedHtml.nodeName !== 'form'
  ) {
    sheetForm = parsedHtml.querySelector(
      '.window-content > form',
    ) as HTMLElement;
  }

  const sheetFormId = _data.document.uuid;
  if (!sheetFormId) {
    return;
  }
  console.debug('Registering Mobile Sheet ', sheetFormId, sheetForm);

  mobileSheets.set(sheetFormId, { mobileViewEnabled: false });

  if (isMobileScreen() || isMobileSize(sheetForm)) {
    mobileSheets.set(sheetFormId, { mobileViewEnabled: true });
    enableMobileView(sheetForm);
  }

  new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const target = entry.target as HTMLElement;
      const targetId = entry.target.id;
      if (!targetId.startsWith('sheetForm')) {
        return;
      }

      const mobileSheet = mobileSheets.get(targetId);
      if (!mobileSheet) return;

      if (!mobileSheet.mobileViewEnabled && isMobileSize(target)) {
        mobileSheet.mobileViewEnabled = true;
        enableMobileView(target);
        return;
      }

      if (mobileSheet.mobileViewEnabled && !isMobileSize(target)) {
        mobileSheet.mobileViewEnabled = false;
        deactivateMobileView(sheetForm);
        return;
      }
    });
  }).observe(sheetForm);
});

function enableMobileView(sheetForm: HTMLElement): void {
  handleMobileSidebar(sheetForm);
  handleCharacterNavigation(sheetForm);
  handleScroll(sheetForm);
  sheetForm.classList.add('mobile-character-sheet');
}

function deactivateMobileView(sheetForm: HTMLElement): void {
  restoreSidebarToMain(sheetForm);
  restoreDefaultActive(sheetForm);
  // Remove navbarlistener
  const mobileSheet = mobileSheets.get(sheetForm.id);
  console.log('deactivating mobile view for', sheetForm, sheetForm.id);
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
