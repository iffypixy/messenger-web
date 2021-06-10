export const scrollToBottom = (element: Element) =>
  element.scrollTop = element.scrollHeight - element.clientHeight;

export const scrollDown = (element: Element, px: number) =>
  element.scrollTop = element.scrollTop + px;

export const getScrollDifference = (element: Element) =>
  element.scrollHeight - (element.scrollTop + element.clientHeight);