export const getDateStringFromDate = (date: string) => {
  return new Date(date).toLocaleDateString("ko-KR");
};
