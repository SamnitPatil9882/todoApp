import todoInfo, { DropdownFilter, Order } from "./todoItem";

export type Action =
    | { type: 'FETCH_SUCCESS'; payload: todoInfo[] }
    | { type: 'FETCH_ERROR' }
    | { type: 'REFETCH'}
    | { type: 'SET_ORDER'; payload:Order }
    | { type: 'SET_FILTER_DATE'; payload:string }
    | { type: 'SET_PAGE'; payload:number }
    | { type: 'SET_PAGE_COUNT'; payload:number }
    | { type: 'SET_PER_PAGE'; payload:number }
    | { type: 'SORT_BY'; payload:DropdownFilter };