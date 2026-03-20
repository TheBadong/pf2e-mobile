/**
 * Handle vertical navigation bar.
 * It will be possible to drag the navigation bar to fixed positions : up, right and left
 */

/**
 * In-memory state.
 * Eventually the final navigation state will be store somewhere in the app. Localstorage maybe?
 */
const navigationBarState = {
  defaultPosition: 'left',
  isBeingDragged: false,
  dropTarget: null,
};

export function handleCharacterNavigation(html: JQuery<HTMLElement>) {
  document
    .querySelector('.character.sheet form')
    ?.classList.add('navigation-sides');

  // Move navigation (will be completely moved when dev is over)
  const parsedHtml = html.get(0) as HTMLElement;
  const sheetNavigationElement = parsedHtml
    ?.querySelector('.window-content form.editable')
    ?.removeChild(
      html.get(0)?.querySelector('.sheet-navigation') as HTMLElement,
    ) as HTMLElement;

  parsedHtml
    ?.querySelector('.sheet-body')
    ?.insertBefore(
      sheetNavigationElement as HTMLElement,
      parsedHtml.querySelector('.sheet-content') as HTMLElement,
    );

  // Handle drag

  sheetNavigationElement.draggable = true;
  // let dragTimeout: NodeJS.Timeout;
  // dragTimeout = setTimeout(() => {
  //   navigationBarState.isBeingDragged = true;
  //   console.debug('is being inited');
  // }, 1000);
  // sheetNavigationElement.addEventListener('pointerdown', (e: PointerEvent) => {
  //   dragTimeout = setTimeout(() => {
  //     navigationBarState.isBeingDragged = true;
  //     console.debug('is being dragged');
  //   }, 1000);
  // });

  // sheetNavigationElement.addEventListener('pointermove', (e: PointerEvent) => {
  //   if (navigationBarState.isBeingDragged) {
  //     const draggedElement = sheetNavigationElement.cloneNode() as HTMLElement;
  //     console.debug('draggedElement');
  //     console.debug('draggine elem to: ', e.x, e.y);

  //     draggedElement.style.position = 'absolute';
  //     draggedElement.style.zIndex = '100';
  //     draggedElement.style.left = e.x + 'px';
  //     draggedElement.style.top = e.y + 'px';
  //   }
  // });

  // sheetNavigationElement.addEventListener('pointerup', (e: PointerEvent) => {
  //   navigationBarState.isBeingDragged = false;
  //   clearTimeout(dragTimeout);
  // });
}
