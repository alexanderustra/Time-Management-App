import { Data } from "../types/types";
import { Errors } from "../types/types";

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}:${String(mins).padStart(2, "0")} h` : `${mins} min`;
};

export const getFormattedTime = (secondsLeft: number): string => {
  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return hours > 0 
    ? `${hours}:${String(minutes).padStart(2, '0')} h`
    : `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export const getProgressPercentage = (end: number, timeLeft: number): number => 
  ((end * 60 - timeLeft) / (end * 60)) * 100;

export const getPercentage = (time: number, end: number): number =>
  (time / end) * 100;


export const validateInputs = (
  data: Data,
  setErrors: React.Dispatch<React.SetStateAction<Errors>>
) => {
  const newErrors: Errors = { end: "", timelines: [], pauses: [] };
  if (data.end < 1) {
    newErrors.end = "End time must be at least 1 minute.";
  }

  data.timelines.forEach((tl, index) => {
    newErrors.timelines[index] =
      tl.time < 0 ? "Timeline time cannot be lower than 0." : "";
  });

  data.pauses.forEach((pause, index) => {
    newErrors.pauses[index] = {
      start: pause.start < 0 ? "Pause start cannot be lower than 0." : "",
      end: pause.end < 0 ? "Pause end cannot be lower than 0." : "",
    };

    if (pause.start > pause.end) {
      newErrors.pauses[index].end = "Pause end must be greater than start.";
    }
  });
  setErrors(newErrors);

  return (
    !newErrors.end &&
    newErrors.timelines.every((err) => err === "") &&
    newErrors.pauses.every((p) => p.start === "" && p.end === "")
  );
};
  

export const hoursOptions = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0")
);
export const minutesOptions = Array.from({ length: 61 }, (_, i) =>
  i.toString().padStart(2, "0")
);
