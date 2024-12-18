export type BaseOmit<T, K extends keyof any> = Omit<
  T,
  K | 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
