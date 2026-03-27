const MAX_MOBILE_SCREEN_WIDTH = 580;

export function isMobileMode(): boolean {
  return window.screen.width < MAX_MOBILE_SCREEN_WIDTH;
}
