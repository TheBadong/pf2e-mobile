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
Hooks.on('renderCharacterSheetPF2e', (app, html, data) => {
  const navigationRow = html.get(0)?.querySelector('.sheet-navigation');
  const activeItem = navigationRow?.querySelector('.active');
  const characterRecapItem = activeItem?.cloneNode(true) as Element;
  characterRecapItem.classList.remove('active');
  navigationRow?.insertBefore(characterRecapItem, navigationRow.childNodes[2]);
});
