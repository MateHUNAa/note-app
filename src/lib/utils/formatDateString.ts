export const formatDateString = (inputDate: Date | string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  const date = typeof inputDate === "string" ? new Date(inputDate) : inputDate;

  return date.toLocaleDateString(undefined, options);
};
