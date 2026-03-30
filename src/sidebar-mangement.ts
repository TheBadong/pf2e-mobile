export function handleMobileSidebar(characterSheet: HTMLElement) {
  buildSidebarNavButton(characterSheet);
  buildSidebarSection(characterSheet);
  moveSidebarToSheet(characterSheet);
}

/**
 * Remove the original sidebar and move it to the sheet content sections
 */
export function moveSidebarToSheet(characterSheet: HTMLElement): void {
  const mainPageForm = document.querySelector('.window-content > form');
  const mainPageAside = mainPageForm?.querySelector('aside');

  if (!mainPageAside) {
    console.error('Error parsing DOM! Mobile mode will not function properly.');
    return;
  }

  const sidebarSection = buildSidebarSection(characterSheet);

  sidebarSection.appendChild(mainPageAside);
}

/**
 * Restore the sidebar to its original location
 */
export function restoreSidebarToMain(characterSheet: HTMLElement): void {
  const sectionAside = characterSheet.querySelector(
    '.sheet-content > section[data-tab="sidebar"] aside',
  );
  if (!sectionAside) {
    console.warn('Could not remove aside from section content.');
    return;
  }
  characterSheet
    .querySelector('.sheet-content > section[data-tab="sidebar"]')
    ?.removeChild(sectionAside);

  const mainPageForm = document.querySelector('.window-content > form');
  mainPageForm?.appendChild(sectionAside);
}

/**
 * If it does not already exist, add the nav button that targets the moved aside
 */
function buildSidebarNavButton(characterSheet: HTMLElement): HTMLElement {
  // Prevent building twice
  let sidebarItemButton = document.querySelector(
    '.sheet-navigation > a[data-tab="sidebar"]',
  ) as HTMLElement | null;
  if (sidebarItemButton) {
    return sidebarItemButton;
  }

  // Build button
  sidebarItemButton = document.createElement('a');
  sidebarItemButton.setAttribute('data-tab', 'sidebar');
  sidebarItemButton.role = 'tab';
  sidebarItemButton.classList.add('item');

  // Button icon
  const sidebarItemIcon = document.createElement('i');
  sidebarItemIcon.classList.add('fa-solid', 'fa-bars');
  sidebarItemButton.appendChild(sidebarItemIcon);

  // Append the new button to the navigation row
  const navigationRow = characterSheet?.querySelector('.sheet-navigation');
  navigationRow?.insertBefore(sidebarItemButton, navigationRow.childNodes[2]);

  return sidebarItemButton;
}

/**
 * If it does not already exist, add the base section that will contain the moved aside
 */
function buildSidebarSection(characterSheet: HTMLElement): HTMLElement {
  let sidebarSection = characterSheet.querySelector(
    '.sidebar-section',
  ) as HTMLElement | null;
  if (sidebarSection) return sidebarSection;

  sidebarSection = document.createElement('section');
  sidebarSection.classList.add('tab', 'sidebar-section', 'major');
  sidebarSection.setAttribute('data-group', 'primary');
  sidebarSection.setAttribute('data-tab', 'sidebar');
  const characterSection = characterSheet?.querySelector(
    'section.tab.character',
  ) as HTMLElement;
  characterSheet
    .querySelector('.sheet-content')
    ?.insertBefore(sidebarSection, characterSection);

  return sidebarSection;
}
