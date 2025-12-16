export interface ApiMessage {
    type: string
    text: string
}

export interface ApiPagination {
    total: number
    per_page: number
    current_page: number
    last_page: number
    from: number
    to: number
}

export interface ApiResponse<T> {
    data: T
    pagination: ApiPagination
    message: ApiMessage
}

export interface Pagination {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    from: number
    to: number
}

export interface PaginatedResponse<T> {
    items: T[]
    pagination: Pagination
}

export interface PaginationParams {
    page?: number
    perPage?: number
}

export interface SortParams {
    orderBy?: string
    order?: 'asc' | 'desc'
}

export interface PaginatedSortParams extends PaginationParams, SortParams {}
