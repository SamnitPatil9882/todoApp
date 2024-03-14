import { useEffect, useState, ChangeEvent } from "react";
import useFetch from "../hooks/useFetch";
import todoInfo, {
  DropdownFilter,
  Order,
  responsePageingation,
} from "../models/todoItem";
import TodoList from "./TodoList";
import { set } from "date-fns";
import ascending from "../assets/ascending.svg";
import SearchBox from "./SearchBox";
import {
  deleteTodo,
  fetchTodos,
  isValidDate,
  updateTodo,
} from "../utilityFunctions";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
const queryClient = new QueryClient();
const TodoStart = () => {
  const [completedTodo, setCompletedTodo] = useState<todoInfo[]>([]);
  const [incompletedTodo, setInCompletedTodo] = useState<todoInfo[]>([]);
  const [order, setOrder] = useState<Order>(Order.asc);
  const [todoArr, setTodoArr] = useState<todoInfo[]>([]);
  const [selectedOption, setSelectedOption] = useState<DropdownFilter>(
    DropdownFilter.date
  );
  const [filteredDate, setFilterDate] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1)
  const per_page = 2;

  const {
    data: responseData,
    // isFetched: pending,
    isFetching: pending,
    error,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["todosData"],
    queryFn: () => fetchTodos({ page, per_page }),
  });

  console.log("RESPONSE: ", responseData);
  // console.log("pendiing: ", pending);
  // console.log("isSuccess: ", isSuccess);
  // console.log("todoArr: ", todoArr);
  // setTodoArr(responseData?.data!)

  useEffect(() => {
    // console.log("responseData useEffect3 : " + responseData);

    if (isSuccess && responseData) {
      console.log(
        "************************ responseData : " , responseData
      );
      
      setTodoArr(responseData.data);
      setPageCount(Math.ceil(Number(responseData.headers.get("x-total-count"))/per_page));

    }
  }, [responseData, isSuccess]);

  // let pageCount = 1;
  // pageCount = responseData?.pages!;

  const { mutate: delTodo } = useMutation({
    mutationFn: deleteTodo,
    mutationKey: ["deleteTodo"],
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["todosData"], exact: true });
    },
  });

  const { mutate: upTodo } = useMutation({
    mutationFn: updateTodo,
    mutationKey: ["updateTodo"],
    onSuccess: (id) => {
      console.log({ id });
      refetch();
      // setTimeout(()=>{queryClient.invalidateQueries({ queryKey: ['todosData'],exact: true ,refetchType: 'active',});},1000)
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
    setSelectedOption(newSelectedOption);
    if (newSelectedOption === DropdownFilter.date) {
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
    // console.log("set todo data: ", responseData);
    refetch();
    if (Array.isArray(todoArr)) {
      // Sort the todoArr array based on the selectedOption
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
    refetch();
  };

  const handleDelete = (id: number) => {
    delTodo(id);
    refetch();
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
      setOrder(Order.desc);
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
      setOrder(Order.asc);
    }
  };

  const handleFilterDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputDate = event.target.value;
    setFilterDate(inputDate.toString());
  };

  const handlePrevChange = () => {
    setPage(page == 1 ? page : page - 1);
    refetch();
  };

  const handleNextChange = () => {
    if (page < pageCount) {
      setPage(page + 1);
    }

    refetch();
  };
  // console.log("responseData useEffect1 : " + responseData);
  useEffect(setTodoData, [page, todoArr, filteredDate]);
  // console.log("responseData useEffect2 : " + responseData);

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

      {responseData && (
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
      {/* loading..... */}

      <div>
        <div
          id="popup-modal"
          tabIndex={-1}
          className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="popup-modal"
              >
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this product?
                </h3>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  Yes, I'm sure
                </button>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoStart;

// const res = await axios.get(`http://localhost:5000/todos?_page=${page}&_limit=${limit}&title_like=${search}&_sort=title&_order=${order}&isCompleted_like=${todoStatus}`);
