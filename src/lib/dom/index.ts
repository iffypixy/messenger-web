export function isElementVisible(elem: HTMLElement): boolean {
  const rect = elem.getBoundingClientRect();

  const viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  );
  
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

export function scrollElementToBottom(element: HTMLElement): void {
  element.scroll(0, element.scrollHeight);
}