import format from "date-fns/format";

export const formatDate = (date: Date): string => {
  const days = Math.ceil((Date.now() - +date) / (1000 * 60 * 60 * 24));
  const scheme = days >= 3 ? "dd.MM.yyyy" : "HH:mm";

  return format(date, scheme);
};
