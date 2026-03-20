/**
 * Handle vertical navigation bar.
 * It will be possible to drag the navigation bar to fixed positions : up, right and left
 */

/**
 * In-memory state.
 * Eventually the final navigation state will be store somewhere in the app. Localstorage maybe?
 */
const navigationBarState: {
  defaultPosition: 'left';
  position: 'left' | 'right';
  isBeingDragged: boolean;
} = {
  defaultPosition: 'left',
  position: 'left',
  isBeingDragged: false,
};

export function handleCharacterNavigation(html: JQuery<HTMLElement>) {
  document
    .querySelector('.character.sheet form')
    ?.classList.add('navigation-sides');

  // Move navigation (will be completely moved when dev is over)
  const parsedHtml = html.get(0) as HTMLElement;
  const sheetBody = parsedHtml.querySelector('.sheet-body') as HTMLElement;
  const sheetContent = parsedHtml.querySelector(
    '.sheet-content',
  ) as HTMLElement;

  const sheetNavigationElement = parsedHtml
    ?.querySelector('.window-content form.editable')
    ?.removeChild(
      html.get(0)?.querySelector('.sheet-navigation') as HTMLElement,
    ) as HTMLElement;

  sheetBody.insertBefore(sheetNavigationElement, sheetContent);

  // Make navigation draggable
  sheetNavigationElement.draggable = true;

  // Build drop zones
  const dropZones = document.createElement('div');
  dropZones.style.display = 'none';
  dropZones.style.backgroundColor = 'darkgray';
  dropZones.style.opacity = '0.8';
  dropZones.style.position = 'absolute';
  dropZones.style.top = '0px';
  dropZones.style.width = '100vw';
  dropZones.style.height = '100vh';

  const dropZoneLeft = document.createElement('div') as HTMLElement;
  dropZoneLeft.style.display = 'inline-block';
  dropZoneLeft.style.width = '50vw';
  dropZoneLeft.style.height = '100vh';
  const dropZoneRight = dropZoneLeft.cloneNode() as HTMLElement;
  dropZones.appendChild(dropZoneLeft);
  dropZones.appendChild(dropZoneRight);

  sheetContent.appendChild(dropZones);

  // Mark sheet body as drag target
  sheetBody.ondragover = (e) => e.preventDefault();

  // Register the target detection div
  sheetNavigationElement.ondragstart = () => {
    dropZones.style.display = 'block';
  };

  sheetNavigationElement.ondragend = () => {
    dropZones.style.display = 'none';
  };

  // Drop target detection
  dropZoneRight.ondragenter = () => {
    if (navigationBarState.position === 'left') {
      navigationBarState.position = 'right';
      sheetNavigationElement.style.order = '1';
    }
  };
  dropZoneLeft.ondragenter = () => {
    if (navigationBarState.position === 'right') {
      navigationBarState.position = 'left';
      sheetNavigationElement.style.order = '-1';
    }
  };
}
