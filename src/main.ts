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
Hooks.on('renderCharacterSheetPF2e', async (_app, html, _data) => {
  const parsedHtml = html.get(0);
  if (!parsedHtml) {
    throw new Error('Could not get character sheet render even html.');
  }
  // Add the new button and icon, based on the current active Item
  const navigationRow = parsedHtml?.querySelector('.sheet-navigation');
  const activeItem = navigationRow?.querySelector('.active');
  const characterRecapItem = activeItem?.cloneNode(true) as Element;
  characterRecapItem.classList.remove('active');
  characterRecapItem.setAttribute('data-tab', 'sidebar');
  characterRecapItem
    .querySelector('i')
    ?.classList.replace('fa-address-card', 'fa-bars');
  navigationRow?.insertBefore(characterRecapItem, navigationRow.childNodes[2]);

  // Add the base section that will contain the moved aside
  const sidebarSection = document.createElement('section');
  sidebarSection.classList.add('tab', 'sidebar-section', 'major');
  sidebarSection.setAttribute('data-group', 'primary');
  sidebarSection.setAttribute('data-tab', 'sidebar');
  parsedHtml.querySelector('.sheet-content')?.appendChild(sidebarSection);

  // Add mutation observer that will trigger sidebar movement
  const sidebarActiveObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName !== 'class') return;
      if ((mutation.target as HTMLElement).classList.contains('active')) {
        console.debug('moving sidebar to sheet section');
        moveSidebarToSheet(parsedHtml);
      } else {
        restoreSidebarToMain(parsedHtml);
      }
    });
  });

  sidebarActiveObserver.observe(characterRecapItem, {
    attributes: true,
    childList: false,
    subtree: false,
  });
});

/**
 * Remove the original sidebar and move it to the sheet content sections
 */
function moveSidebarToSheet(parsedHtml: HTMLElement): void {
  const mainPageForm = document.querySelector('.window-content > form');
  const mainPageAside = mainPageForm?.querySelector('aside');
  if (!mainPageAside) {
    console.error('Error parsing DOM! Mobile mode will not function properly.');
    return;
  }
  parsedHtml.querySelector('.sidebar-section')?.appendChild(mainPageAside);
}

/**
 * Restore the sidebar to its original location
 */
function restoreSidebarToMain(parsedHtml: HTMLElement): void {
  const sectionAside = parsedHtml.querySelector(
    '.sheet-content > section[data-tab="sidebar"] aside',
  );
  if (!sectionAside) {
    throw new Error('Could not remove aside from section content.');
  }
  parsedHtml
    .querySelector('.sheet-content > section[data-tab="sidebar"]')
    ?.removeChild(sectionAside);

  const mainPageForm = document.querySelector('.window-content > form');
  mainPageForm?.appendChild(sectionAside);
}
