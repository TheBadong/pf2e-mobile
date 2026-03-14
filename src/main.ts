import { MODULE_ID } from './config';
import './styles/index.scss';

// CONFIG.debug.hooks = !CONFIG.debug.hooks;
// console.warn('Set Hook Debugging to', CONFIG.debug.hooks);

console.log('init module2');

const sidebarLocations = {
  default: 'default',
  sheet: 'sheet',
} as const;

type SidebarLocation = keyof typeof sidebarLocations | null;

Hooks.once('init', () => {
  console.debug('pf2e mobile startss');
  // Reset session
  sessionStorage.removeItem(`${MODULE_ID}_sidebar_state`);
});

/**
 * Add a new button that displays the sidebar information in a dedicated page
 */
Hooks.on('renderCharacterSheetPF2e', async (_app, html, _data) => {
  console.debug({ _app, _data });
  const parsedHtml = html.get(0);
  if (!parsedHtml) {
    throw new Error('Could not get character sheet render even html.');
  }

  const sidebarLocation = sessionStorage.getItem(
    `${MODULE_ID}_sidebar_state`,
  ) as SidebarLocation;

  // Build the new button
  const sidebarItemButton = document.createElement('a');
  sidebarItemButton.setAttribute('data-tab', 'sidebar');
  sidebarItemButton.role = 'tab';
  sidebarItemButton.classList.add('item');
  // If the current sidebar state is 'sheet', set the sidebar tab as active
  if (sidebarLocation === 'sheet') {
    parsedHtml.querySelectorAll('.sheet-navigation > .item').forEach((node) => {
      node.classList.remove('active');
    });
    sidebarItemButton.classList.add('active');
  }

  // Button icon
  const sidebarItemIcon = document.createElement('i');
  sidebarItemIcon.classList.add('fa-solid', 'fa-bars');
  sidebarItemButton.appendChild(sidebarItemIcon);

  // Append the new button to the navigation row
  const navigationRow = parsedHtml?.querySelector('.sheet-navigation');
  navigationRow?.insertBefore(sidebarItemButton, navigationRow.childNodes[2]);

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

  sidebarActiveObserver.observe(sidebarItemButton, {
    attributes: true,
    childList: false,
    subtree: false,
  });

  // On render, the click hooks on the items aren't yet registered.
  // So we cheat a little by forcing the display of the sidebar tab if it was in sheet mode before this render.
  if (sidebarLocation === 'sheet') {
    moveSidebarToSheet(parsedHtml);
    parsedHtml
      .querySelectorAll('.sheet-content > .tab')
      .forEach((node) => node.classList.remove('active'));
    parsedHtml.querySelector('.sidebar-section')?.classList.add('active');
  }

  // Okay so cheat #2
  // The base render's got some default mecanism that registers the current active tab on render, regardless of the .active class
  // Because of this, whenever this sheet renders, the "character" tab is always considered "selected",
  // and if we are in sidebar sheet mode and try to select the "character" tab right after a render,
  // nothing happens.
  // So, add a click listener on the character tab if we rendered in sidebar sheet mode, and display as expected
  // Gosh this sucks
  if (sidebarLocation === 'sheet') {
    const characterTabButton = parsedHtml.querySelector(
      '.sheet-navigation > a[data-tab="character"]',
    ) as HTMLElement;
    const listener = (_: MouseEvent) => {
      console.debug('clicking character button');
      // Hide sheet sidebar
      document
        .querySelector('.sheet-navigation > a[data-tab="sidebar"]')
        ?.classList.remove('active');
      document
        .querySelector('.sheet-content > section[data-tab="sidebar"]')
        ?.classList.remove('active');

      // Show character tab
      characterTabButton.classList.add('active');
      parsedHtml
        .querySelector('.sheet-content > [data-tab="character"]')
        ?.classList.add('active');
      characterTabButton.removeEventListener('click', listener);
    };

    characterTabButton?.addEventListener('click', listener);
  }
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

  sessionStorage.setItem(`${MODULE_ID}_sidebar_state`, sidebarLocations.sheet);
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

  sessionStorage.setItem(
    `${MODULE_ID}_sidebar_state`,
    sidebarLocations.default,
  );
}
