import { mobileSheets } from './sheets';

/** Saved scroll positiion */
let registeredScroll = 0;
/**
 * Make the Character Sheet scrollable
 */
export function handleScroll(characterSheet: HTMLElement) {
  const mobileSheet = mobileSheets.get(characterSheet.id);
  if (!mobileSheet) {
    console.error(
      'Sheet not registered for mobile use! Skipping scroll process.',
    );
    return;
  }

  const sheetContent = characterSheet.querySelector(
    '.sheet-content',
  ) as HTMLElement;

  const sheetNavigation = characterSheet.querySelector(
    '.sheet-navigation',
  ) as HTMLElement;

  makeAllSectionsActive(characterSheet);

  // Register scroll for isntant scroll back on reload
  // Refactor this sometime
  sheetContent.onscroll = () => {
    registeredScroll = sheetContent.scrollTop;
    const visibleSection = resolveVisibleSection(
      characterSheet,
      registeredScroll,
    );
    setActiveTab(visibleSection?.getAttribute('data-tab') as SectionTab);
  };

  // Instantly scroll to the last registered scroll position
  sheetContent.scroll({ top: registeredScroll, left: 0, behavior: 'instant' });

  // Set active item on render
  setActiveTab(
    resolveVisibleSection(characterSheet, registeredScroll)?.getAttribute(
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

function setActiveTab(tabName: SectionTab): void {
  document.querySelectorAll('a.item').forEach((navItem) => {
    (navItem as HTMLElement).classList.remove('active');
  });
  console.debug('setting active on ', tabName);
  document
    .querySelector(`a.item[data-tab="${tabName}"]`)
    ?.classList.add('active');
}

function getSections(
  characterSheet: HTMLElement,
): Record<SectionTab, HTMLElement> {
  return {
    sidebar: characterSheet.querySelector('.a.sidebar') as HTMLElement,
    character: characterSheet.querySelector('.tab.character') as HTMLElement,
    actions: characterSheet.querySelector('.tab.actions') as HTMLElement,
    inventory: characterSheet.querySelector('.tab.inventory') as HTMLElement,
    spellcasting: characterSheet.querySelector(
      '.tab.spellcasting',
    ) as HTMLElement,
    crafting: characterSheet.querySelector('.tab.crafting') as HTMLElement,
    proficiencies: characterSheet.querySelector(
      '.tab.proficiencies',
    ) as HTMLElement,
    feats: characterSheet.querySelector('.tab.feats') as HTMLElement,
    effects: characterSheet.querySelector('.tab.effects') as HTMLElement,
    biography: characterSheet.querySelector('.tab.biography') as HTMLElement,
    pfs: characterSheet.querySelector('.tab.pfs') as HTMLElement,
  };
}

function resolveVisibleSection(
  characterSheet: HTMLElement,
  scrollValue: number,
): HTMLElement | null {
  /**
   * For SOME REASON even though the scroll instruction is an int,
   * the resolved value in the event is a float, very close to the target value.
   * So round it to resolve the correct section.
   */
  scrollValue = Math.round(scrollValue);
  const sections = getSections(characterSheet);

  if (scrollValue < sections.character.offsetTop) {
    return getSectionByName(characterSheet, 'sidebar');
  } else if (scrollValue < sections.actions.offsetTop) {
    return getSectionByName(characterSheet, 'character');
  } else if (scrollValue < sections.inventory.offsetTop) {
    return getSectionByName(characterSheet, 'actions');
  } else if (scrollValue < sections.spellcasting.offsetTop) {
    return getSectionByName(characterSheet, 'inventory');
  } else if (scrollValue < sections.crafting.offsetTop) {
    return getSectionByName(characterSheet, 'spellcasting');
  } else if (scrollValue < sections.proficiencies.offsetTop) {
    return getSectionByName(characterSheet, 'crafting');
  } else if (scrollValue < sections.feats.offsetTop) {
    return getSectionByName(characterSheet, 'proficiencies');
  } else if (scrollValue < sections.effects.offsetTop) {
    return getSectionByName(characterSheet, 'feats');
  } else if (scrollValue < sections.biography.offsetTop) {
    return getSectionByName(characterSheet, 'effects');
  } else if (
    scrollValue <
    sections.pfs.offsetTop - 1 /** no one will ever know */
  ) {
    return getSectionByName(characterSheet, 'biography');
  } else {
    return getSectionByName(characterSheet, 'pfs');
  }
}

function getSectionByName(
  characterSheet: HTMLElement,
  name: SectionTab,
): HTMLElement | null {
  return characterSheet.querySelector(`.tab[data-tab="${name}"]`);
}

/**
 * add the "active" class to alll the sheet' sections
 */
export function makeAllSectionsActive(characterSheet: HTMLElement): void {
  for (const child of characterSheet.querySelector('.sheet-content')
    ?.children ?? []) {
    child.classList.add('active');
  }
}

/**
 * Remove the "active" class from all tje sheet' sections and make only the default tab active
 * TODO (later): make active the tab that was active in the opposite state
 */
export function restoreDefaultActive(characterSheet: HTMLElement): void {
  for (const child of characterSheet.querySelector('.sheet-content')
    ?.children ?? []) {
    child.classList.remove('active');
  }

  characterSheet
    .querySelector('.sheet-content .tab.character.major')
    ?.classList.add('active');
}
