import { mobileSheets } from './sheets';

/** Saved scroll positiion */
let registeredScroll = 0;
/**
 * Make the Character Sheet scrollable
 */
export function handleScroll(html: JQuery<HTMLElement>) {
  const parsedHtml = html.get(0);
  if (!parsedHtml) {
    throw new Error('Could not get character sheet render even html.');
  }

  const mobileSheet = mobileSheets.get(parsedHtml.id);
  if (!mobileSheet) {
    console.error(
      'Sheet not registered for mobile use! Skipping scroll process.',
    );
    return;
  }

  const sheetContent = parsedHtml.querySelector(
    '.sheet-content',
  ) as HTMLElement;

  const sheetNavigation = parsedHtml.querySelector(
    '.sheet-navigation',
  ) as HTMLElement;

  makeAllSectionsActive(parsedHtml);

  // Register scroll for isntant scroll back on reload
  // Refactor this sometime
  sheetContent.onscroll = () => {
    registeredScroll = sheetContent.scrollTop;
    const visibleSection = resolveVisibleSection(parsedHtml, registeredScroll);
    setActiveTab(visibleSection?.getAttribute('data-tab') as SectionTab);
  };

  // Instantly scroll to the last registered scroll position
  sheetContent.scroll({ top: registeredScroll, left: 0, behavior: 'instant' });

  // Set active item on render
  setActiveTab(
    resolveVisibleSection(parsedHtml, registeredScroll)?.getAttribute(
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

function getSections(parsedHtml: HTMLElement): Record<SectionTab, HTMLElement> {
  return {
    sidebar: parsedHtml.querySelector('.a.sidebar') as HTMLElement,
    character: parsedHtml.querySelector('.tab.character') as HTMLElement,
    actions: parsedHtml.querySelector('.tab.actions') as HTMLElement,
    inventory: parsedHtml.querySelector('.tab.inventory') as HTMLElement,
    spellcasting: parsedHtml.querySelector('.tab.spellcasting') as HTMLElement,
    crafting: parsedHtml.querySelector('.tab.crafting') as HTMLElement,
    proficiencies: parsedHtml.querySelector(
      '.tab.proficiencies',
    ) as HTMLElement,
    feats: parsedHtml.querySelector('.tab.feats') as HTMLElement,
    effects: parsedHtml.querySelector('.tab.effects') as HTMLElement,
    biography: parsedHtml.querySelector('.tab.biography') as HTMLElement,
    pfs: parsedHtml.querySelector('.tab.pfs') as HTMLElement,
  };
}

function resolveVisibleSection(
  parsedHtml: HTMLElement,
  scrollValue: number,
): HTMLElement | null {
  /**
   * For SOME REASON even though the scroll instruction is an int,
   * the resolved value in the event is a float, very close to the target value.
   * So round it to resolve the correct section.
   */
  scrollValue = Math.round(scrollValue);
  const sections = getSections(parsedHtml);

  if (scrollValue < sections.character.offsetTop) {
    return getSectionByName(parsedHtml, 'sidebar');
  } else if (scrollValue < sections.actions.offsetTop) {
    return getSectionByName(parsedHtml, 'character');
  } else if (scrollValue < sections.inventory.offsetTop) {
    return getSectionByName(parsedHtml, 'actions');
  } else if (scrollValue < sections.spellcasting.offsetTop) {
    return getSectionByName(parsedHtml, 'inventory');
  } else if (scrollValue < sections.crafting.offsetTop) {
    return getSectionByName(parsedHtml, 'spellcasting');
  } else if (scrollValue < sections.proficiencies.offsetTop) {
    return getSectionByName(parsedHtml, 'crafting');
  } else if (scrollValue < sections.feats.offsetTop) {
    return getSectionByName(parsedHtml, 'proficiencies');
  } else if (scrollValue < sections.effects.offsetTop) {
    return getSectionByName(parsedHtml, 'feats');
  } else if (scrollValue < sections.biography.offsetTop) {
    return getSectionByName(parsedHtml, 'effects');
  } else if (
    scrollValue <
    sections.pfs.offsetTop - 1 /** no one will ever know */
  ) {
    return getSectionByName(parsedHtml, 'biography');
  } else {
    return getSectionByName(parsedHtml, 'pfs');
  }
}

function getSectionByName(
  parsedHtml: HTMLElement,
  name: SectionTab,
): HTMLElement | null {
  return parsedHtml.querySelector(`.tab[data-tab="${name}"]`);
}

/**
 * add the "active" class to alll the sheet' sections
 */
export function makeAllSectionsActive(parsedHtml: HTMLElement): void {
  for (const child of parsedHtml.querySelector('.sheet-content')?.children ??
    []) {
    child.classList.add('active');
  }
}

/**
 * Remove the "active" class from all tje sheet' sections and make only the default tab active
 * TODO (later): make active the tab that was active in the opposite state
 */
export function restoreDefaultActive(parsedHtml: HTMLElement): void {
  for (const child of parsedHtml.querySelector('.sheet-content')?.children ??
    []) {
    child.classList.remove('active');
  }

  parsedHtml
    .querySelector('.sheet-content .tab.character.major')
    ?.classList.add('active');
}
