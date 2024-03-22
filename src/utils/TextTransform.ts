export const capitalizeName = (text: string) => {
  let newText = text.charAt(0).toUpperCase() + text.slice(1);
  return newText;
};
