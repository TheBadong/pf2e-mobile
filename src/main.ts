import { MODULE_ID } from './config';
import {
  handleCharacterNavigation,
  handleSwipe,
} from './navigation-management';
import { handleMobileSidebar } from './sidebar-mangement';
import './styles/index.scss';
import { handleScroll } from './templates/scroll-management';

// CONFIG.debug.hooks = !CONFIG.debug.hooks;
// console.warn('Set Hook Debugging to', CONFIG.debug.hooks);

Hooks.once('init', () => {
  console.debug('pf2e mobile startss');
  // Reset session
  sessionStorage.removeItem(`${MODULE_ID}_sidebar_state`);
});

/**
 * Add a new button that displays the sidebar information in a dedicated page
 */
Hooks.on('renderCharacterSheetPF2e', async (_app, html, _data) => {
  handleMobileSidebar(html);
  handleCharacterNavigation(html);
  handleSwipe(html);
  handleScroll(html);
});
