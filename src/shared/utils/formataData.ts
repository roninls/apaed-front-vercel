export const formataData = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date.toString()));
};
