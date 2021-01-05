import {isElementVisible} from "@lib/dom";

interface Options {
  read?: boolean;
  own?: boolean;
}

export const getMessagesIds = (element: Element, {read = false, own = false}: Options): string[] => {
  const elements = (Array.from(element.children) as HTMLElement[]).filter(
    (elem) => elem.dataset.own === String(own) && elem.dataset.read === String(read)
  );

  const idx = [...elements].reverse().findIndex((elem) => isElementVisible(elem));

  if (idx === -1) return [];

  return elements
    .slice(0, elements.length - idx)
    .map((elem) => elem.dataset.id as string);
};
