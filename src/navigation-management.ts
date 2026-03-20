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
  dropTarget: 'left' | 'right' | null;
} = {
  defaultPosition: 'left',
  position: 'left',
  isBeingDragged: false,
  dropTarget: null,
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

  // Handle drag
  const dropZones = document.createElement('div');
  dropZones.style.display = 'none';
  dropZones.style.position = 'absolute';
  dropZones.style.top = '0px';
  dropZones.style.width = '100vw';
  dropZones.style.height = '100vh';

  const dropZoneLeft = document.createElement('div') as HTMLElement;
  dropZoneLeft.style.display = 'inline-block';
  dropZoneLeft.style.width = '50vw';
  dropZoneLeft.style.height = '100vh';
  const dropZoneRight = dropZoneLeft.cloneNode() as HTMLElement;

  // Mark sheet body as drag target
  sheetBody.ondragover = (e) => e.preventDefault();
  sheetBody.ondrop = (e: DragEvent) => {
    console.log('dropped on target ', navigationBarState.dropTarget);
    console.log('target', e.target, e);
    switch (navigationBarState.dropTarget) {
      case 'left':
        if (navigationBarState.position === 'right') {
          navigationBarState.position = 'left';
          sheetNavigationElement.style.order = '-1';
        }
        break;
      case 'right':
        if (navigationBarState.position === 'left') {
          navigationBarState.position = 'right';
          sheetNavigationElement.style.order = '1';
        }
        break;
    }
  };

  dropZoneRight.ondragenter = (e: DragEvent) => {
    console.debug('Entered right drop zone');
    navigationBarState.dropTarget = 'right';
  };
  dropZoneLeft.ondragenter = (e: DragEvent) => {
    console.debug('Entered left drop zone');
    navigationBarState.dropTarget = 'left';
  };

  dropZones.appendChild(dropZoneLeft);
  dropZones.appendChild(dropZoneRight);

  sheetContent.appendChild(dropZones);

  sheetNavigationElement.draggable = true;
  sheetNavigationElement.ondragstart = (e: DragEvent) => {
    console.debug('drag start!');
    dropZones.style.display = 'block';
  };

  sheetNavigationElement.ondragend = (e: DragEvent) => {
    console.debug('drag end!');
    dropZones.style.display = 'none';
  };
}

function previewDrop(): void {}
