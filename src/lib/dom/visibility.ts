export const isElementVisible = (element: Element) => {
  const rect = element.getBoundingClientRect();

  const viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  );

  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
};