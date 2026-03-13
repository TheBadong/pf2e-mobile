import { MODULE_ID } from './config';
import './styles/index.scss';

// CONFIG.debug.hooks = !CONFIG.debug.hooks;
// console.warn('Set Hook Debugging to', CONFIG.debug.hooks);

console.log('init module2');

Hooks.once('init', () => {
  console.debug('pf2e mobile startss');
});

/**
 * Add a new button that displays the sidebar information in a dedicated page
 */
Hooks.on('renderCharacterSheetPF2e', async (app, html, data) => {
  // Add the new button and icon
  const navigationRow = html.get(0)?.querySelector('.sheet-navigation');
  const activeItem = navigationRow?.querySelector('.active');
  const characterRecapItem = activeItem?.cloneNode(true) as Element;
  characterRecapItem.classList.remove('active');
  characterRecapItem.setAttribute('data-tab', 'sidebar');
  characterRecapItem
    .querySelector('i')
    ?.classList.replace('fa-address-card', 'fa-bars');
  navigationRow?.insertBefore(characterRecapItem, navigationRow.childNodes[2]);

  // Remove the original sidebar and move it to the sheet content sections
  console.debug('DOM', document);
  const mainPageForm = document.querySelector('.window-content > form');
  const mainPageAside = mainPageForm?.querySelector('aside');
  if (!mainPageAside) {
    console.error('Error parsing DOM! Mobile mode will not function properly.');
    return;
  }

  const sidebarSection = document.createElement('section');
  sidebarSection.classList.add('tab', 'sidebar-section', 'major');
  sidebarSection.setAttribute('data-group', 'primary');
  sidebarSection.setAttribute('data-tab', 'sidebar');
  sidebarSection.appendChild(mainPageAside);

  html.get(0)?.querySelector('.sheet-content')?.appendChild(sidebarSection);
});
