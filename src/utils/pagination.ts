export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

export const getPaginationOptions = (query: any) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, parseInt(query.limit) || 10);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};