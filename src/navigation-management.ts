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

export function handleCharacterNavigation(html: JQuery<HTMLElement>) {
  // Move navigation (will be completely moved when dev is over)
  const parsedHtml = html.get(0) as HTMLElement;
  const sheetContent = parsedHtml.querySelector(
    '.sheet-content',
  ) as HTMLElement;
  const sheetForm = document.querySelector(
    '.window-content form.editable',
  ) as HTMLElement;
  const sheetNavigationElement = parsedHtml.querySelector(
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

export function handleSwipe(html: JQuery<HTMLElement>) {
  const parsedHtml = html.get(0) as HTMLElement;
  const sheetBody = parsedHtml.querySelector('.sheet-body') as HTMLElement;

  let pointerState: {
    pointerDown: boolean;
    origX: number;
    origY: number;
    x: number;
    y: number;
  } = {
    pointerDown: false,
    origX: 0,
    origY: 0,
    x: 0,
    y: 0,
  };

  sheetBody.addEventListener('pointerdown', (e) => {
    pointerState = {
      pointerDown: true,
      origX: e.clientX,
      origY: e.clientY,
      x: e.clientX,
      y: e.clientY,
    };
  });

  sheetBody.addEventListener('pointermove', (e) => {
    if (!pointerState.pointerDown) {
      return;
    }

    pointerState = {
      ...pointerState,
      x: e.clientX,
      y: e.clientY,
    };

    console.debug(pointerState.origX, pointerState.x);

    if (pointerState.x - pointerState.origX > 100) {
      console.debug('swiped 100 pixels!');
    }
  });

  sheetBody.addEventListener('pointerup', () => {
    pointerState.pointerDown = false;
  });
}
