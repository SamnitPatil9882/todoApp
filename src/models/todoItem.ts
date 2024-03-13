interface todoInfo{
    title: string;
    description: string;
    isCompleted: boolean;
    id: number;
    selectedDate:Date;
}
export enum Order {
    asc = "asc",
    desc = "desc"
  };

export enum DropdownFilter{
    date= "date",
    title= "title"
}
export default todoInfo;