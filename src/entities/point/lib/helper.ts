export const normalizePoint = (point: number | null | undefined) => {
  if (point === null || point === undefined) {
    return 0;
  }

  return point;
};
