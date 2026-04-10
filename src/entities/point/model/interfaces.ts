export interface IPointTransaction<TDto> {
  createHistory: (dto: TDto) => Promise<void>;
  updateUserPoint: (userId: number, amount: number) => Promise<void>;
}
