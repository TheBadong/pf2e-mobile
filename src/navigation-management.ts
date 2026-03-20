export function handleCharacterNavigation(html: JQuery<HTMLElement>) {
  /**
   * Make sheet sidebar vertical
   */

  document
    .querySelector('.character.sheet form')
    ?.classList.add('navigation-sides');

  // Move navigation (will be completely moved when dev is over)
  const parsedHtml = html.get(0);
  const sheetNavigationElement = parsedHtml
    ?.querySelector('.window-content form.editable')
    ?.removeChild(
      html.get(0)?.querySelector('.sheet-navigation') as HTMLElement,
    );

  parsedHtml
    ?.querySelector('.sheet-body')
    ?.insertBefore(
      sheetNavigationElement as HTMLElement,
      parsedHtml.querySelector('.sheet-content') as HTMLElement,
    );
}
