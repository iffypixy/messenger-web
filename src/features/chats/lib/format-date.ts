import format from "date-fns/format";
import intervalToDuration from "date-fns/intervalToDuration";

export const formatMessageDate = (date: Date): string => {
  const days = Math.ceil((Date.now() - +date) / (1000 * 60 * 60 * 24));
  const scheme = days >= 3 ? "dd.MM.yyyy" : "HH:mm";

  return format(date, scheme);
};

export const formatAudioDuration = (sec: number): string => {
  const normalize = (time: string): string =>
    time.length === 1 ? `0${time}` : time;

  const {hours, minutes, seconds} = intervalToDuration({
    start: 0, end: sec * 1000
  });

  const hoursOutput = hours ? `${normalize(String(hours))}:` : "";

  return `${hoursOutput}${normalize(String(minutes))}:${normalize(String(seconds))}`;
};