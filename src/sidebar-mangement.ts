export function handleMobileSidebar(html: JQuery<HTMLElement>) {
  const parsedHtml = html.get(0);
  if (!parsedHtml) {
    throw new Error('Could not get character sheet render even html.');
  }

  // Build the new button
  const sidebarItemButton = document.createElement('a');
  sidebarItemButton.setAttribute('data-tab', 'sidebar');
  sidebarItemButton.role = 'tab';
  sidebarItemButton.classList.add('item');

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
  const characterSection = parsedHtml?.querySelector(
    'section.tab.character',
  ) as HTMLElement;
  parsedHtml
    .querySelector('.sheet-content')
    ?.insertBefore(sidebarSection, characterSection);

  moveSidebarToSheet(parsedHtml);
}

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
// function restoreSidebarToMain(parsedHtml: HTMLElement): void {
//   const sectionAside = parsedHtml.querySelector(
//     '.sheet-content > section[data-tab="sidebar"] aside',
//   );
//   if (!sectionAside) {
//     console.warn('Could not remove aside from section content.');
//     return;
//   }
//   parsedHtml
//     .querySelector('.sheet-content > section[data-tab="sidebar"]')
//     ?.removeChild(sectionAside);

//   const mainPageForm = document.querySelector('.window-content > form');
//   mainPageForm?.appendChild(sectionAside);
// }
