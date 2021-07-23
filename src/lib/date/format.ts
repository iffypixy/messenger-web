import intervalToDuration from "date-fns/intervalToDuration";

const normalize = (time: number): string => {
  const date = String(time);

  return date.length === 1 ? `0${date}` : date;
};

export const formatDuration = (duration: number): string => {
  if (!duration) return "00:00";

  const {hours: hrs, minutes, seconds} = intervalToDuration({
    start: 0, end: duration * 1000
  });

  const hours = hrs ? `${normalize(hrs)}:` : "";

  return `${hours}${normalize(minutes!)}:${normalize(seconds!)}`;
};