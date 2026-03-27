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
}
