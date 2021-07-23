export const scrollToBottom = (element: HTMLElement) => element.scrollTop = element.scrollHeight - element.clientHeight;

export const isAtTop = (element: HTMLElement) => element.scrollTop === 0;

export const getOuterHeight = (element: HTMLElement) => {
  const styles = window.getComputedStyle(element);
  const margin = parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

  return Math.round(element.offsetHeight + margin);
};

export const isElementVisible = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();

  const viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  );

  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
};