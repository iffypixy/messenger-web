export const scrollToBottom = (element: Element) =>
  element.scrollTop = element.scrollHeight - element.clientHeight;

export const getBottomOffset = (element: Element) =>
  element.scrollHeight - (element.scrollTop + element.clientHeight);

export const getTopOffset = (element: Element) => element.scrollTop;