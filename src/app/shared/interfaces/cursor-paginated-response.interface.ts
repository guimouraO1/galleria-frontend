export interface CursorPaginatedResponse<T> {
    items: T[];
    nextCursor: string | null;
    hasNext: boolean;
}
