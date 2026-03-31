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
  overPosition: 'left' | 'right' | 'top';
  position: 'left' | 'right' | 'top';
  isBeingDragged: boolean;
} = {
  defaultPosition: 'left',
  overPosition: 'left',
  position: 'left',
  isBeingDragged: false,
};

export function handleCharacterNavigation(sheetForm: HTMLElement) {
  // Move navigation (will be completely moved when dev is over)
  const sheetContent = sheetForm.querySelector('.sheet-content') as HTMLElement;
  const sheetNavigationElement = sheetForm.querySelector(
    '.sheet-navigation',
  ) as HTMLElement;

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
  dropZoneLeft.style.height = '80vh';
  const dropZoneRight = dropZoneLeft.cloneNode() as HTMLElement;
  const dropZoneTop = document.createElement('div') as HTMLElement;
  dropZoneTop.style.display = 'inline-block';
  dropZoneTop.style.width = '100vw';
  dropZoneTop.style.height = '10vh';
  dropZones.appendChild(dropZoneTop);
  dropZones.appendChild(dropZoneLeft);
  dropZones.appendChild(dropZoneRight);

  sheetContent.appendChild(dropZones);

  // Register the target detection div
  sheetNavigationElement.ondragstart = () => {
    dropZones.style.display = 'block';
  };

  // Stop drag and register the new position
  sheetNavigationElement.ondragend = () => {
    dropZones.style.display = 'none';
    navigationBarState.position = navigationBarState.overPosition;
  };

  // Drop target detection
  dropZoneRight.ondragenter = () => {
    if (navigationBarState.position !== 'right') {
      navigationBarState.overPosition = 'right';
      sheetForm.classList.add('navigation-sides');
      sheetNavigationElement.classList.add('navigation-right');
    }
  };
  dropZoneLeft.ondragenter = () => {
    if (navigationBarState.position !== 'left') {
      navigationBarState.overPosition = 'left';
      sheetForm.classList.add('navigation-sides');
      sheetNavigationElement.classList.remove('navigation-right');
    }
  };
  dropZoneTop.ondragenter = () => {
    if (navigationBarState.position !== 'top') {
      navigationBarState.overPosition = 'top';
      sheetForm.classList.remove('navigation-sides');
    }
  };
}
