export function handleMobileSidebar(sheetForm: HTMLElement) {
  buildSidebarNavButton(sheetForm);
  buildSidebarSection(sheetForm);
  moveSidebarToSheet(sheetForm);
}

/**
 * Remove the original sidebar and move it to the sheet content sections
 */
export function moveSidebarToSheet(sheetForm: HTMLElement): void {
  const sheetAside = sheetForm?.querySelector('aside');

  if (!sheetAside) {
    console.error('Error parsing DOM! Mobile mode will not function properly.');
    return;
  }

  const sidebarSection = buildSidebarSection(sheetForm);

  sidebarSection.appendChild(sheetAside);
}

/**
 * Restore the sidebar to its original location
 */
export function restoreSidebarToMain(sheetForm: HTMLElement): void {
  const sectionAside = sheetForm.querySelector(
    '.sheet-content > section[data-tab="sidebar"] aside',
  );
  if (!sectionAside) {
    console.warn('Could not remove aside from section content.');
    return;
  }
  sheetForm
    .querySelector('.sheet-content > section[data-tab="sidebar"]')
    ?.removeChild(sectionAside);

  sheetForm.appendChild(sectionAside);
}

/**
 * If it does not already exist, add the nav button that targets the moved aside
 */
function buildSidebarNavButton(sheetForm: HTMLElement): HTMLElement {
  // Prevent building twice
  let sidebarItemButton = sheetForm.querySelector(
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
  const navigationRow = sheetForm?.querySelector('.sheet-navigation');
  navigationRow?.insertBefore(sidebarItemButton, navigationRow.childNodes[2]);

  return sidebarItemButton;
}

/**
 * If it does not already exist, add the base section that will contain the moved aside
 */
function buildSidebarSection(sheetForm: HTMLElement): HTMLElement {
  let sidebarSection = sheetForm.querySelector(
    '.sidebar-section',
  ) as HTMLElement | null;
  if (sidebarSection) return sidebarSection;

  sidebarSection = document.createElement('section');
  sidebarSection.classList.add('tab', 'sidebar-section', 'major');
  sidebarSection.setAttribute('data-group', 'primary');
  sidebarSection.setAttribute('data-tab', 'sidebar');
  const characterSection = sheetForm?.querySelector(
    'section.tab.character',
  ) as HTMLElement;
  sheetForm
    .querySelector('.sheet-content')
    ?.insertBefore(sidebarSection, characterSection);

  return sidebarSection;
}
