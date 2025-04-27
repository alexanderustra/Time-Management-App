export const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
export const calculateDuration = (start: string, end?: string): number => {
  const convertToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };


  const startMinutes = convertToMinutes(start);
  const endMinutes = end
    ? convertToMinutes(end)
    : new Date().getHours() * 60 + new Date().getMinutes();

  return endMinutes >= startMinutes
    ? endMinutes - startMinutes
    : 1440 - startMinutes + endMinutes;
};
export const getRandomPastelHex = (): string => {
  const randomValue = () => Math.floor(127 + Math.random() * 128); 
  const toHex = (value: number) => value.toString(16).padStart(2, "0"); 

  let r, g, b;

  do {
    r = randomValue();
    g = randomValue();
    b = randomValue();
  } while (Math.abs(r - g) < 50 && Math.abs(r - b) < 50 && Math.abs(g - b) < 50); 

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};