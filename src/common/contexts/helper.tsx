export const childrenPath = (path: string, param?: string) =>
  param ? path.replace(/:\w+\?/, param) : path.replace(/\/:\w+\?/, "");
