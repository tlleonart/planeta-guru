import { mapPagination } from "../shared/mappers/pagination-mapper";
import type { ApiPagination, Pagination } from "../shared/types/api-types";
import { getHttpClient } from ".";
import type { HttpClient } from "./client";

export abstract class BaseService {
  protected readonly http: HttpClient;

  constructor() {
    this.http = getHttpClient();
  }

  protected mapPagination(api: ApiPagination): Pagination {
    return mapPagination(api);
  }

  protected buildPaginationParams(params: {
    page?: number;
    perPage?: number;
  }): Record<string, number | undefined> {
    return {
      page: params.page,
      per_page: params.perPage,
    };
  }

  protected buildSortParams(params: {
    orderBy?: string;
    order?: "asc" | "desc";
  }): Record<string, string | undefined> {
    return {
      order_by: params.orderBy,
      order: params.order,
    };
  }

  protected buildQueryParams(params: {
    page?: number;
    perPage?: number;
    orderBy?: string;
    order?: "asc" | "desc";
  }): Record<string, string | number | undefined> {
    return {
      ...this.buildPaginationParams(params),
      ...this.buildSortParams(params),
    };
  }
}
