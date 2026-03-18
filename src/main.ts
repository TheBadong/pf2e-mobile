import { MODULE_ID } from './config';
import { handleMobileSidebar } from './sidebar-mangement';
import './styles/index.scss';

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
  console.debug('handleMobileSidebar');
  handleMobileSidebar(html);
  /**
   * Make sheet sidebar vertical
   */

  // Move duplciate sidebar (will be completel moved when dev is over)
  const parsedHtml = html.get(0);
  const sheetNavigationElement = parsedHtml
    ?.querySelector('.window-content form.editable')
    ?.removeChild(
      html.get(0)?.querySelector('.sheet-navigation') as HTMLElement,
    );

  parsedHtml
    ?.querySelector('.sheet-body')
    ?.appendChild(sheetNavigationElement as HTMLElement);
});
