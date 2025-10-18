export const normalizeArray = <T>(data: T | T[]): T[] =>
  Array.isArray(data) ? data : [data];

export const normalizeObject = <T>(data: T | T[]): T =>
  Array.isArray(data) ? data[0] : data;
