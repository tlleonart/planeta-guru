import type { ApiPagination, Pagination } from "../types/api-types";

export function mapPagination(api: ApiPagination): Pagination {
  return {
    total: api.total,
    perPage: api.per_page,
    currentPage: api.current_page,
    lastPage: api.last_page,
    from: api.from,
    to: api.to,
  };
}

export function mapPaginatedResponse<TApi, TDomain>(
  items: TApi[],
  pagination: ApiPagination,
  mapItem: (item: TApi) => TDomain
): {
  items: TDomain[];
  pagination: Pagination;
} {
  return {
    items: items.map(mapItem),
    pagination: mapPagination(pagination),
  };
}

export function mapPaginatedResponsePassthrough<T>(
  items: T[],
  pagination: ApiPagination
): {
  items: T[];
  pagination: Pagination;
} {
  return {
    items,
    pagination: mapPagination(pagination),
  };
}