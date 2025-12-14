export const generateSKU = (id: string) => {
  return `PRD-${id.padStart(6, "0")}`;
};
