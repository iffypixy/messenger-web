const bias = document.documentElement.clientHeight * 0.2;

export const scrollToBottom = (element: Element) => element.scrollTop = element.scrollHeight - element.clientHeight;
export const isAtTop = (element: Element) => element.scrollTop === 0;
export const isAtBottom = (element: Element) => element.scrollTop + element.clientHeight + bias >= element.scrollHeight