import { mobileSheets } from './sheets';

/** Saved scroll positiion */
let registeredScroll = 0;
/**
 * Make the Character Sheet scrollable
 */
export function handleScroll(sheetForm: HTMLElement) {
  const mobileSheet = mobileSheets.get(sheetForm.id);
  if (!mobileSheet) {
    console.error(
      'Sheet not registered for mobile use! Skipping scroll process.',
    );
    return;
  }

  const sheetContent = sheetForm.querySelector('.sheet-content') as HTMLElement;

  const sheetNavigation = sheetForm.querySelector(
    '.sheet-navigation',
  ) as HTMLElement;

  makeAllSectionsActive(sheetForm);

  // Register scroll for isntant scroll back on reload
  // Refactor this sometime
  sheetContent.onscroll = () => {
    registeredScroll = sheetContent.scrollTop;
    const visibleSection = resolveVisibleSection(sheetForm, registeredScroll);
    setActiveTab(
      sheetForm,
      visibleSection?.getAttribute('data-tab') as SectionTab,
    );
  };

  // Instantly scroll to the last registered scroll position
  sheetContent.scroll({ top: registeredScroll, left: 0, behavior: 'instant' });

  // Set active item on render
  setActiveTab(
    sheetForm,
    resolveVisibleSection(sheetForm, registeredScroll)?.getAttribute(
      'data-tab',
    ) as SectionTab,
  );

  // Register scroll listener if it does not already exist
  if (!mobileSheet.navbarListener) {
    mobileSheet.navbarListener = (e) => {
      // Prevent all other click events on the navbar
      e.stopPropagation();

      const clickedNavItem = (e.target as HTMLElement)?.closest('a.item');
      const targetTabName = clickedNavItem?.getAttribute(
        'data-tab',
      ) as SectionTab | null;
      if (!targetTabName) return;

      // Show newly selected nav item
      //setActiveTab(targetTabName);

      // Scroll to the newly selected item
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
    };
  }

  sheetNavigation.addEventListener('click', mobileSheet.navbarListener, {
    capture: true,
  });
}

function setActiveTab(sheetForm: HTMLElement, tabName: SectionTab): void {
  sheetForm.querySelectorAll('a.item').forEach((navItem) => {
    (navItem as HTMLElement).classList.remove('active');
  });
  sheetForm
    .querySelector(`a.item[data-tab="${tabName}"]`)
    ?.classList.add('active');
}

function getSections(sheetForm: HTMLElement): Record<SectionTab, HTMLElement> {
  return {
    sidebar: sheetForm.querySelector('.a.sidebar') as HTMLElement,
    character: sheetForm.querySelector('.tab.character') as HTMLElement,
    actions: sheetForm.querySelector('.tab.actions') as HTMLElement,
    inventory: sheetForm.querySelector('.tab.inventory') as HTMLElement,
    spellcasting: sheetForm.querySelector('.tab.spellcasting') as HTMLElement,
    crafting: sheetForm.querySelector('.tab.crafting') as HTMLElement,
    proficiencies: sheetForm.querySelector('.tab.proficiencies') as HTMLElement,
    feats: sheetForm.querySelector('.tab.feats') as HTMLElement,
    effects: sheetForm.querySelector('.tab.effects') as HTMLElement,
    biography: sheetForm.querySelector('.tab.biography') as HTMLElement,
    pfs: sheetForm.querySelector('.tab.pfs') as HTMLElement,
  };
}

function resolveVisibleSection(
  sheetForm: HTMLElement,
  scrollValue: number,
): HTMLElement | null {
  /**
   * For SOME REASON even though the scroll instruction is an int,
   * the resolved value in the event is a float, very close to the target value.
   * So round it to resolve the correct section.
   */
  scrollValue = Math.round(scrollValue);
  const sections = getSections(sheetForm);

  if (scrollValue < sections.character.offsetTop) {
    return getSectionByName(sheetForm, 'sidebar');
  } else if (scrollValue < sections.actions.offsetTop) {
    return getSectionByName(sheetForm, 'character');
  } else if (scrollValue < sections.inventory.offsetTop) {
    return getSectionByName(sheetForm, 'actions');
  } else if (scrollValue < sections.spellcasting.offsetTop) {
    return getSectionByName(sheetForm, 'inventory');
  } else if (scrollValue < sections.crafting.offsetTop) {
    return getSectionByName(sheetForm, 'spellcasting');
  } else if (scrollValue < sections.proficiencies.offsetTop) {
    return getSectionByName(sheetForm, 'crafting');
  } else if (scrollValue < sections.feats.offsetTop) {
    return getSectionByName(sheetForm, 'proficiencies');
  } else if (scrollValue < sections.effects.offsetTop) {
    return getSectionByName(sheetForm, 'feats');
  } else if (scrollValue < sections.biography.offsetTop) {
    return getSectionByName(sheetForm, 'effects');
  } else if (
    scrollValue <
    sections.pfs.offsetTop - 1 /** no one will ever know */
  ) {
    return getSectionByName(sheetForm, 'biography');
  } else {
    return getSectionByName(sheetForm, 'pfs');
  }
}

function getSectionByName(
  sheetForm: HTMLElement,
  name: SectionTab,
): HTMLElement | null {
  return sheetForm.querySelector(`.tab[data-tab="${name}"]`);
}

/**
 * add the "active" class to alll the sheet' sections
 */
export function makeAllSectionsActive(sheetForm: HTMLElement): void {
  for (const child of sheetForm.querySelector('.sheet-content')?.children ??
    []) {
    child.classList.add('active');
  }
}

/**
 * Remove the "active" class from all tje sheet' sections and make only the default tab active
 * TODO (later): make active the tab that was active in the opposite state
 */
export function restoreDefaultActive(sheetForm: HTMLElement): void {
  for (const child of sheetForm.querySelector('.sheet-content')?.children ??
    []) {
    child.classList.remove('active');
  }

  sheetForm
    .querySelector('.sheet-content .tab.character.major')
    ?.classList.add('active');
}
