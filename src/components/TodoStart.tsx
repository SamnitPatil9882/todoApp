import { useEffect, useState, ChangeEvent, useReducer } from "react";
import todoInfo, { DropdownFilter, Order, todoFetchResponse, todoResponse } from "../models/todoItem";
import TodoList from "./TodoList";
import SearchBox from "./SearchBox";
import { deleteTodo, fetchTodos, updateTodo } from "../utilityFunctions";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { todoReducer } from "../models/reducers";
import { Action } from "@remix-run/router";
const queryClient = new QueryClient();


const initialState: todoResponse = {
  todoArr: [],
  pending: false,
  error:"",
  refetch:false,
  isSuccess:true,
  order:Order.asc,
  fileterDate:"",
  page:1,
  pageCount:1,
  per_page:2,
  selectedOption:DropdownFilter.title,
};

const TodoStart = () => {
  const [completedTodo, setCompletedTodo] = useState<todoInfo[]>([]);
  const [incompletedTodo, setInCompletedTodo] = useState<todoInfo[]>([]);
  const [filteredDate, setFilterDate] = useState<string>("");

  const [{todoArr,page,pageCount,per_page,isSuccess,error,pending,refetch,selectedOption,order},dispatch] = useReducer(todoReducer,initialState);

  console.log("todoData: ",{todoArr,page,pageCount,per_page,isSuccess,error,pending,refetch});
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response= await fetchTodos({ page, per_page });
        console.log("response",response.data);
        
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
        dispatch({ type: "SET_PAGE_COUNT", payload:Math.ceil(Number(response.headers.get("x-total-count"))/per_page)})

      } catch (error) {
        dispatch({ type: "FETCH_ERROR" });
      }
    };

    fetchData(); 
  }, [ page, per_page,pending]);


  const { mutate: delTodo } = useMutation({
    mutationFn: deleteTodo,
    mutationKey: ["deleteTodo"],
    onSuccess: () => {
      dispatch({ type: "REFETCH" });
      queryClient.invalidateQueries({ queryKey: ["todosData"], exact: true }); 
    },
  });

  const { mutate: upTodo } = useMutation({
    mutationFn: updateTodo,
    mutationKey: ["updateTodo"],
    onSuccess: (id) => {
      console.log({ id }); 
      dispatch({ type: "REFETCH" });
      queryClient.invalidateQueries({
        queryKey: ["todosData"],
        exact: true,
        refetchType: "active",
      });
    },
  });

  const sortTodo = (
    todoArray: todoInfo[],
    setTodoArray: React.Dispatch<React.SetStateAction<todoInfo[]>>,
    by: DropdownFilter
  ): void => {
    let sortedArray: todoInfo[] = [];
    switch (by) {
      case DropdownFilter.title:
        sortedArray = [...todoArray].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;
      case DropdownFilter.date:
        sortedArray = [...todoArray].sort(
          (a, b) =>
            new Date(a.selectedDate).getTime() -
            new Date(b.selectedDate).getTime()
        );
        break;
      default:
        sortedArray = todoArray;
        break;
    }
    setTodoArray(sortedArray);
  };

  const handleDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newSelectedOption = event.target.value as DropdownFilter;
    dispatch({type: "SORT_BY", payload:newSelectedOption})
    if (newSelectedOption === DropdownFilter.date) {
      console.log("filter: date: ",newSelectedOption," : ",order);
      
      const sortedCompletedTodoArr = [...completedTodo].sort((a, b) => {
        const dateA = new Date(a.selectedDate).getTime();
        const dateB = new Date(b.selectedDate).getTime();
        return dateA - dateB;
      });

      const sortedIncompleteTodoArr = [...incompletedTodo].sort((a, b) => {
        const dateA = new Date(a.selectedDate).getTime();
        const dateB = new Date(b.selectedDate).getTime();
        return dateA - dateB;
      });

      setCompletedTodo(sortedCompletedTodoArr);
      setInCompletedTodo(sortedIncompleteTodoArr);
    } else {
      console.log("filter: title: ",newSelectedOption," : ",order);
      const sortedCompletedTodoArr = [...completedTodo].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      const sortedIncompleteTodoArr = [...incompletedTodo].sort((a, b) =>
        a.title.localeCompare(b.title)
      );

      setCompletedTodo(sortedCompletedTodoArr);
      setInCompletedTodo(sortedIncompleteTodoArr);
    }

    if (order === Order.desc) {
      setCompletedTodo((prevCompletedTodo) => prevCompletedTodo.reverse());
      setInCompletedTodo((prevIncompletedTodo) =>
        prevIncompletedTodo.reverse()
      );
    }
  };

  function setTodoData() {
    // refetch();
    // dispatch({type:"REFETCH"})
    if (Array.isArray(todoArr)) {
      const sortedTodoArr = [...todoArr].sort((a, b) => {
        const aValue = a[selectedOption as keyof todoInfo];
        const bValue = b[selectedOption as keyof todoInfo];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue);
        } else {
          return 0;
        }
      });

      const completed = sortedTodoArr.filter(
        (todo) =>
          todo.isCompleted &&
          (!filteredDate ||
            new Date(filteredDate).getTime() ===
              new Date(todo.selectedDate).getTime())
      );
      const incompleted = sortedTodoArr.filter(
        (todo) =>
          !todo.isCompleted &&
          (!filteredDate ||
            new Date(filteredDate).getTime() ===
              new Date(todo.selectedDate).getTime())
      );

      setCompletedTodo(completed);
      setInCompletedTodo(incompleted);
    }
  }

  const checkChanges = (id: number, isCompleted: boolean) => {
    upTodo({ id, isCompleted });
  };

  const handleDelete = (id: number) => {
    delTodo(id);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    console.log(searchTerm);

    if (todoArr) {
      const filteredCompletedTodo = todoArr.filter(
        (todo) => todo.isCompleted && todo.title.includes(searchTerm)
      );
      const filteredInCompletedTodo = todoArr.filter(
        (todo) => !todo.isCompleted && todo.title.includes(searchTerm)
      );

      sortTodo(filteredCompletedTodo, setCompletedTodo, selectedOption);
      sortTodo(filteredInCompletedTodo, setInCompletedTodo, selectedOption);

      if (order == Order.desc) {
        setCompletedTodo((prevCompletedTodo) =>
          [...prevCompletedTodo].reverse()
        );
        setInCompletedTodo((prevInCompletedTodo) =>
          [...prevInCompletedTodo].reverse()
        );
      }
    }
  };

  const handleOrderChange = () => {

    if (order === Order.asc) {
      if (selectedOption === DropdownFilter.title) {
        const sortedCompletedTodoArr = [...completedTodo].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        const sortedIncompleteTodoArr = [...incompletedTodo].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        setCompletedTodo(sortedCompletedTodoArr);
        setInCompletedTodo(sortedIncompleteTodoArr);
      } else if (selectedOption === DropdownFilter.date) {
        const sortedCompletedTodoArr = [...completedTodo].sort(
          (a, b) =>
            new Date(a.selectedDate).getTime() -
            new Date(b.selectedDate).getTime()
        );
        const sortedIncompleteTodoArr = [...incompletedTodo].sort(
          (a, b) =>
            new Date(a.selectedDate).getTime() -
            new Date(b.selectedDate).getTime()
        );
        setCompletedTodo(sortedCompletedTodoArr);
        setInCompletedTodo(sortedIncompleteTodoArr);
      }
      // setOrder(Order.desc);
      dispatch({type: "SET_ORDER",payload:Order.desc})
    } else {
      if (selectedOption === DropdownFilter.title) {
        const sortedCompletedTodoArr = [...completedTodo]
          .sort((a, b) => a.title.localeCompare(b.title))
          .reverse();
        const sortedIncompleteTodoArr = [...incompletedTodo]
          .sort((a, b) => a.title.localeCompare(b.title))
          .reverse();
        setCompletedTodo(sortedCompletedTodoArr);
        setInCompletedTodo(sortedIncompleteTodoArr);
      } else if (selectedOption === DropdownFilter.date) {
        const sortedCompletedTodoArr = [...completedTodo]
          .sort(
            (a, b) =>
              new Date(a.selectedDate).getTime() -
              new Date(b.selectedDate).getTime()
          )
          .reverse();
        const sortedIncompleteTodoArr = [...incompletedTodo]
          .sort(
            (a, b) =>
              new Date(a.selectedDate).getTime() -
              new Date(b.selectedDate).getTime()
          )
          .reverse();
        setCompletedTodo(sortedCompletedTodoArr);
        setInCompletedTodo(sortedIncompleteTodoArr);
      }
      // setOrder(Order.asc);
      dispatch({type: "SET_ORDER",payload:Order.asc})
    }
  };

  const handleFilterDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputDate = event.target.value;
    setFilterDate(inputDate.toString());
  };

  const handlePrevChange = () => {
    // setPage(page == 1 ? page : page - 1);
    page == 1 ? dispatch({type: "SET_PAGE", payload:1}) : dispatch({type: "SET_PAGE", payload:page - 1});
    
    // refetch();
    dispatch({type:"REFETCH"})
  };

  const handleNextChange = () => {
    if (page < pageCount) {
      dispatch({type: "SET_PAGE", payload:page + 1})
    }

    // refetch();
    dispatch({type:"REFETCH"})
  };
  useEffect(setTodoData, [page, todoArr, filteredDate]);

  console.log("HERE");

  return (
    <div>
      {pending && (
        <div className="w-full flex flex-col items-center ">
          Wait a moment Data is loading...
        </div>
      )}

      {error && (
        <div className="w-full flex flex-col items-center ">
          Something went wrong!
        </div>
      )}

      {todoArr && (
        <div className="w-full h-full flex flex-col">
          <SearchBox
            handleOrderChange={handleOrderChange}
            handleSearchChange={handleSearchChange}
            order={order}
            selectedOption={selectedOption}
            handleDropdownChange={handleDropdownChange}
            handleFilterDateChange={handleFilterDateChange}
          />
          <div className="flex flex-row">
            <button onClick={handlePrevChange}>Prev</button>
            {page}of{pageCount}
            <button onClick={handleNextChange}>Next</button>
          </div>
          <div className="flex flex-row">
            <div className="w-1/2 border m-2 shadow">
              {<h1>InComplete todo</h1>}

              <TodoList
                todoList={incompletedTodo}
                checkChanges={checkChanges}
                handleDelete={handleDelete}
              />
            </div>

            <div className="w-1/2 border m-2 shadow">
              {<h1>Completed todo</h1>}
              <TodoList
                todoList={completedTodo}
                checkChanges={checkChanges}
                handleDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoStart;
