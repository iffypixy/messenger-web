export const scrollToBottom = (element: Element) =>
  element.scrollTop = element.scrollHeight - element.clientHeight;

export const isAtTop = (element: Element) =>
  element.scrollTop === 0;

export const isAtBottom = (element: Element) =>
  element.scrollTop + element.clientHeight === element.scrollHeight;

export const INFINITE_SCROLL = 10000000000000;