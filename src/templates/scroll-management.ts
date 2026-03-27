/**
 * Make the Character Sheet scrollable
 */
let registeredScroll = 0;
export function handleScroll(html: JQuery<HTMLElement>) {
  const parsedHtml = html.get(0);
  if (!parsedHtml) {
    throw new Error('Could not get character sheet render even html.');
  }
  const sheetContent = parsedHtml.querySelector(
    '.sheet-content',
  ) as HTMLElement;

  const sheetNavigation = parsedHtml.querySelector(
    '.sheet-navigation',
  ) as HTMLElement;

  // Add active on all elements (probably a bad idea)
  for (const child of sheetContent.children) {
    child.classList.add('active');
  }

  // Register scroll for isntant scroll back on reload
  sheetContent.onscroll = () => {
    registeredScroll = sheetContent.scrollTop;
  };

  // Instantly scroll to the last registered scroll position
  sheetContent.scroll({ top: registeredScroll, left: 0, behavior: 'instant' });

  // Prevent all other click events on the navbar
  sheetNavigation.addEventListener(
    'click',
    (e) => {
      e.stopPropagation();
      console.debug('clicked');
      const targetTabName = (e.target as HTMLElement)
        ?.closest('a.item')
        ?.getAttribute('data-tab');
      if (!targetTabName) return;

      const targetSection = sheetContent.querySelector(
        `[data-tab="${targetTabName}"]`,
      ) as HTMLElement | null;

      if (!targetSection) {
        console.error(`Could not scroll to ${targetTabName}! No such tab.`);
      }

      sheetContent.scrollTo({
        top: targetSection?.offsetTop,
        left: 0,
        behavior: 'instant',
      });
    },
    { capture: true },
  );
}
