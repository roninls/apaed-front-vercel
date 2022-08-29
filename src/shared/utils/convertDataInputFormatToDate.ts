export const convertDataInputFormatToDateServerFormat = (data: string): string => {
  const splittedData = data.split('-');
  return new Date(
    Number(splittedData[0]),
    Number(splittedData[1]) - 1,
    Number(splittedData[2]),
    0,
    0,
    0,
    0,
  ).toISOString();
};
