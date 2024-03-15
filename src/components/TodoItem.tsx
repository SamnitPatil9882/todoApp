import { Link, useNavigate } from "react-router-dom";
import todoInfo from "../models/todoItem";
import { differenceInDays, format } from "date-fns";

function TodoItem(props: {
  todoItem: todoInfo;
  checkChanges: (id: number, isChecked: boolean) => void;
  handleDelete: (id: number) => void;
}) {
  const navigate = useNavigate();
  const handleNavigate = (id: number) => {
    navigate("/todo/" + id);
  };
  const formattedDate = format(props.todoItem.selectedDate, "MM/dd/yyyy"); // Format the selected date
  const remainingDays = differenceInDays(
    props.todoItem.selectedDate,
    new Date()
  );
  return (
    <div className="w-full flex flex-wrap flex-row m-4 p-2 border shadow min-w-96">
      <div
        className="flex-grow items-center border shadow-lg m-1"
        style={{ width: 10 }}
      >
        <div className="mx-w-200 flex items-center m-2 p-2">
          <input
            type="checkbox"
            className="w-6 h-6 checked:bg-blue-500 p-0 m-0"
            checked={props.todoItem.isCompleted}
            onChange={() => {
              console.log("props compleed: ",props.todoItem.isCompleted);
              console.log("props compleed : : ",!props.todoItem.isCompleted);
              
              
              props.checkChanges(props.todoItem.id, !props.todoItem.isCompleted);
            }}
          />
          <div
            className="flex-grow flex flex-col m-2 items-center"
            style={{ width: 10 }}
            onClick={() => handleNavigate(props.todoItem.id)}
          >
            <h2 className="text-3xl w-full flex justify-center">
              {props.todoItem.title}
            </h2>
            <div className="w-fit-content flex flex-col items-center font-bold">
              <p className="overflow-auto">{props.todoItem.description}</p>{" "}
              {/* Update this line */}
            </div>
            <div className="flex flex-col">
              <span className="text-2xl">{formattedDate}</span>
            </div>
            <div>
              <div>Remaining days: </div>
              <div>{remainingDays}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="m-1 flex items-center">
        <button
          data-modal-target="popup-modal"
          data-modal-toggle="popup-modal"
          className="bg-red-500 text-white rounded-xl p-2"
          onClick={() => {
            props.handleDelete(props.todoItem.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
