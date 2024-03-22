export const parseMobile = (text: string) => {
  const lastTen = text.slice(-10);

  text = lastTen;

  const digits = text.replace(/[^0-9]/g, "").length;
  if (digits <= 3) {
    text = text.replace(/[^0-9]/g, "");
  } else if (digits <= 6) {
    text = text.replace(/[^0-9]/g, "");
    text = text.replace(/(\d{3})(\d{1,3})/, "($1)$2");
  } else {
    text = text.replace(/[^0-9]/g, "");
    text = text.replace(/(\d{3})(\d{1,3})(\d{1,4})/, "($1)$2-$3");
  }
  text = text.substring(0, 13);

  return text;
};
