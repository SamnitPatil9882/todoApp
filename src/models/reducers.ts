import { Action } from "./actions";
import { DropdownFilter, Order, todoResponse } from "./todoItem";

export const todoReducer = (state: todoResponse, action: Action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        ...state,
        todoArr: action.payload,
        pending: false,
        error: "",
      };
    case "FETCH_ERROR":
      return {
        ...state,
        todoArr: [],
        pending: false,
        error: "something went wrong",
      };
    case "REFETCH":
        console.log("refetching...");
        
      return {
        ...state,
        todoArr: [],
        pending: true,
        error: "",
      };
    case "SET_ORDER":
      let orderedData = state.todoArr.slice();
      if (state.selectedOption === DropdownFilter.date) {
        if (action.payload === Order.asc) {
          orderedData.sort(
            (a, b) => a.selectedDate.getTime() - b.selectedDate.getTime()
          );
        } else {
          orderedData.sort(
            (a, b) => b.selectedDate.getTime() - a.selectedDate.getTime()
          );
        }
      } else if (state.selectedOption === DropdownFilter.title) {
        if (action.payload === Order.asc) {
          orderedData.sort((a, b) => a.title.localeCompare(b.title));
        } else {
          orderedData.sort((a, b) => b.title.localeCompare(a.title));
        }
      }
      return {
        ...state,
        order: action.payload,
        data: orderedData,
      };
    case "SET_PAGE":
      return {
        ...state,
        page: action.payload,
      };
    case "SET_PAGE_COUNT":
      return {
        ...state,
        pageCount: action.payload,
      };
      case "SORT_BY":
        return {
          ...state,
          selectedOption: action.payload,
        };
    default:
      return state;
  }
};
