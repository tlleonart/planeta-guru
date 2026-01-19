import type { ApiPagination, Pagination } from "../types/api-types";

export function mapPagination(api: ApiPagination): Pagination {
  return {
    total: api?.total ?? 0,
    perPage: api?.per_page ?? 0,
    currentPage: api?.current_page ?? 0,
    lastPage: api?.last_page ?? 0,
    from: api?.from ?? 0,
    to: api?.to ?? 0,
  };
}

export function mapPaginatedResponse<TApi, TDomain>(
  items: TApi[],
  pagination: ApiPagination,
  mapItem: (item: TApi) => TDomain,
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
  pagination: ApiPagination,
): {
  items: T[];
  pagination: Pagination;
} {
  return {
    items,
    pagination: mapPagination(pagination),
  };
}
