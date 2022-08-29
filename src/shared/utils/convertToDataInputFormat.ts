export const convertToDataInputFormat = (date: Date) => {
  return `${date.getFullYear()}-${
    date.getMonth() > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
  }-${date.getDate()}`;
};
