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
  const characterSheet = html.get(0) as HTMLElement;
  const characterSheetId = characterSheet.id;

  console.debug('Registering Mobile Sheet ', characterSheetId);

  mobileSheets.set(characterSheetId, { mobileViewEnabled: false });

  if (isMobileScreen()) {
    mobileSheets.set(characterSheetId, { mobileViewEnabled: true });
    enableMobileView(characterSheet);
  }

  new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const target = entry.target as HTMLElement;
      const targetId = entry.target.id;
      if (!targetId.startsWith('CharacterSheet')) {
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
        deactivateMobileView(characterSheet);
        return;
      }
    });
  }).observe(characterSheet);
});

function enableMobileView(characterSheet: HTMLElement): void {
  handleMobileSidebar(characterSheet);
  handleCharacterNavigation(characterSheet);
  handleScroll(characterSheet);
  characterSheet.classList.add('mobile-character-sheet');
}

function deactivateMobileView(characterSheet: HTMLElement): void {
  restoreSidebarToMain(characterSheet);
  restoreDefaultActive(characterSheet);
  // Remove navbarlistener
  const mobileSheet = mobileSheets.get(characterSheet.id);
  if (mobileSheet) {
    characterSheet
      .querySelector('nav.sheet-navigation')
      ?.removeEventListener(
        'click',
        mobileSheet?.navbarListener as EventListener,
        { capture: true },
      );
    mobileSheet.navbarListener = undefined;
  }

  characterSheet.classList.remove('mobile-character-sheet');
}
