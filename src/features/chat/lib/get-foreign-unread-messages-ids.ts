import {isElementVisible} from "@lib/dom";

export const getForeignUnreadMessagesIds = (element: Element): string[] => {
  const elements = (Array.from(element.children) as HTMLElement[]).filter(
    (elem) => elem.dataset.own === "false" && elem.dataset.read === "false"
  );

  const idx = [...elements]
    .reverse()
    .findIndex((elem) => isElementVisible(elem));

  if (idx === -1) return [];

  return elements
    .slice(0, elements.length - idx)
    .map((elem) => elem.dataset.id as string);
};
