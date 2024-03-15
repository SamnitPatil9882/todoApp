interface todoInfo {
  title: string;
  description: string;
  isCompleted: boolean;
  id: number;
  selectedDate: Date;
}

export interface todoPost {
  title: string;
  description: string;
  isCompleted: boolean;
  selectedDate: Date;
}
export enum Order {
  asc = "asc",
  desc = "desc",
}

export enum DropdownFilter {
  date = "date",
  title = "title",
}

export interface responsePageingation {
  data: todoInfo[];
  first: number;
  items: number;
  last: number;
  next: number;
  pages: number;
  prev?: number;
}

export interface todoFetchResponse{
  data: todoInfo[];
  headers: any
}

export interface todoResponse{
  todoArr: todoInfo[],
  pending: boolean,
  error:string,
  refetch:boolean,
  isSuccess:boolean,
  order:Order,
  fileterDate:string,
  page:number,
  pageCount:number,
  per_page:number,
  selectedOption:DropdownFilter,
}
export default todoInfo;
