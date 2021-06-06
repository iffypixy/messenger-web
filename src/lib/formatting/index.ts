import intervalToDuration from "date-fns/intervalToDuration";

export const formatDuration = (duration: number): string => {
  const normalize = (time: string): string =>
    time.length === 1 ? `0${time}` : time;

  const {hours, minutes, seconds} = intervalToDuration({
    start: 0, end: duration
  });

  const hoursOutput = hours ? `${normalize(String(hours))}:` : "";

  return `${hoursOutput}${normalize(String(minutes))}:${normalize(String(seconds))}`;
};