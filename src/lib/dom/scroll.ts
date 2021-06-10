export const scrollToBottom = (element: Element) =>
  element.scrollTop = element.scrollHeight;

export const scrollDown = (element: Element, px: number) =>
  element.scrollTop = element.scrollTop + px;