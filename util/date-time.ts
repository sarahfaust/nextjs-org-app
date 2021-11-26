export function getTimeStringFromDateObj(inputDate: Date) {
  // LEARNINGS:
  // inputDate.getHours().toString() is a)redundant and b) returns a weird string
  // inputDate needs to be a Date object and not a timestamp
  // getMinutes() returns 0 on a full hour, this needs to be changed to '00'
  // in order to be used as string for HTML input type=date
  return `${
    inputDate.getHours() < 10
      ? `0${inputDate.getHours()}`
      : inputDate.getHours()
  }:${
    inputDate.getMinutes() < 10
      ? `0${inputDate.getMinutes()}`
      : inputDate.getMinutes()
  }`;
}

export function setTimeInDateObj(time: string) {
  const date = new Date();
  date.setHours(Number(time.slice(0, 2)));
  date.setMinutes(Number(time.slice(3, 5)));
  return date;
}
