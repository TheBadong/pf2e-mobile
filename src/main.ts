import {
  handleCharacterNavigation,
  handleSwipe,
} from './navigation-management';
import { handleMobileSidebar, restoreSidebarToMain } from './sidebar-mangement';
import './styles/index.scss';
import { handleScroll, restoreDefaultActive } from './scroll-management';
import { isMobileSize } from './utils';

let mobileMode = false;

Hooks.once('init', () => {
  console.debug('pf2e mobile starts');
});

/**
 * Add a new button that displays the sidebar information in a dedicated page
 */
Hooks.on('renderCharacterSheetPF2e', async (_app, html, _data) => {
  const parsedHtml = html.get(0) as HTMLElement;
  console.debug(parsedHtml);

  new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.target.id.startsWith('CharacterSheet')) {
        return;
      }

      if (!mobileMode && isMobileSize(parsedHtml)) {
        mobileMode = true;
        handleMobileSidebar(html);
        handleCharacterNavigation(html);
        handleSwipe(html);
        handleScroll(html);
        parsedHtml.classList.add('mobile-character-sheet');
        return;
      }

      if (mobileMode && !isMobileSize(parsedHtml)) {
        //TODO: revert all mobile changes
        mobileMode = false;
        restoreSidebarToMain(parsedHtml);
        restoreDefaultActive(parsedHtml);
        parsedHtml.classList.remove('mobile-character-sheet');
        return;
      }
    });
  }).observe(parsedHtml);

  if (!isMobileSize(parsedHtml)) {
    return;
  }
});
