export function isElementVisible(elem: Element): boolean {
  const rect = elem.getBoundingClientRect();

  const viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  );
  
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}
