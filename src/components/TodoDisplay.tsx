import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import TodoItem from "./TodoItem";
import todoInfo from "../models/todoItem";
import { useState } from "react";

function TodoDisplay() {
  const { id } = useParams();
  const {
    data: todoArr,
    ispending: pending,
    error,
    refetch
  } = useFetch<todoInfo>("http://localhost:8000/todos/" + id);

  const [deleteError, setDeleteError] = useState<string>("");
  const navigate =  useNavigate();

  const handleDelete = () => {
    console.log("Delete: tododisplay");
    
    fetch(`http://localhost:8000/todos/${id}`, {
      method: "DELETE",
    })
      .then((response) => navigate(`/`))
      .catch((err) => setDeleteError(err.message));
  };

  const hancleCheckChange = () => {
    fetch(`http://localhost:8000/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        isCompleted:!todoArr?.isCompleted,
    })
    })
    .then((response) => refetch())
    .catch((err) => setDeleteError(err.message));
  }
  return (
    <div>
      {pending && <div>Wait a moment Data is Loading ...</div>}
      {error && <div>Error...</div>}
      {deleteError && <div>Error in deleting element</div>}
      {todoArr && (
        <div className="flex flex-col items-center">
          <div>
            <input
              type="checkbox"
              id="chk"
              className="w-6 h-6 checked:bg-blue-500 p-0 m-0"
              checked={todoArr.isCompleted }
              onChange={hancleCheckChange}
            />
            <label htmlFor="chk">Checked</label>
          </div>
          <div className="mx-w-200 flex flex-col m-2 items-center ">
            <h2 className="text-3xl   w-full flex justify-center">
              {todoArr.title}
            </h2>
            <h4 className="text-2xl ">{todoArr.description}</h4>
          </div>
          <div className="m-1 flex items-center">
            <button
              className="bg-red-500 text-white rounded-xl p-2"
              onClick={() => {
                handleDelete();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoDisplay;
