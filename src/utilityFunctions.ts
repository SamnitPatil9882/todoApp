import todoInfo, { todoPost } from "./models/todoItem";

export const getCurrentDateString = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const day = currentDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};
export function isValidDate(dateString: string) {
  // Attempt to create a new Date object using the provided input
  const date = new Date(dateString);

  // Check if the constructed date object is valid
  // and the input date string matches the constructed date string
  return (
    !isNaN(date.getTime()) && dateString === date.toISOString().split("T")[0]
  );
}

// export const fetchTodos = async () => {
//   const response = await fetch("http://localhost:8000/todos?_page=1&_per_page=2");
//   const data = await response.json();
//   return data;
// };
export const fetchTodos = async ({page,per_page}:{page:number,per_page:number}) => {
  const response = await fetch(`http://localhost:8000/todos?_page=${page}&_limit=${per_page}`);
  console.log(response.headers.get('x-total-count'))
  const data:todoInfo[] = await response.json();
  
  return {data , headers:response.headers};
};


export const postTodo = async (todoData: todoPost) => {
  try {
    const response = await fetch("http://localhost:8000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      throw new Error("Failed to add todo");
    }

    return response.json();
  } catch (error) {
    // Handle any errors here, such as logging or re-throwing
    console.error("Error adding todo:", error);
    throw error;
  }
};

export const deleteTodo = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:8000/todos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }

    return response.json(); // Return parsed response data if needed
  } catch (error) {
    // Handle any errors here, such as logging or re-throwing
    console.error("Error deleting todo:", error);
    throw error;
  }
};


export const updateTodo = async ({ id, isCompleted }: { id: number; isCompleted: boolean }) => {
  try {
    const response = await fetch(`http://localhost:8000/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        isCompleted,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to update todo");
    }

    const responseData = await response.json(); // Parse response data

    console.log("update: completed: ", isCompleted, " : ", responseData);

    return responseData; // Return parsed response data
  } catch (error) {
    // Handle any errors here, such as logging or re-throwing
    console.error("Error updating todo:", error);
    throw error;
  }
};
