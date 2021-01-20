export const getById = (idToCompare: string) => (obj: { id: string }) =>
  obj.id === idToCompare;
