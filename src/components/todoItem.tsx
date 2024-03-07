import { Link, useNavigate } from "react-router-dom";
import todoInfo from "../models/todoItem";

function TodoItem(props: { todoItem: todoInfo, checkChanges: (id: number) => void, handleDelete: (id: number) => void }) {
    console.log("todoItem: ", props.todoItem);
    const navigate = useNavigate();
    const handleNavigate = (id: number) =>{
        navigate("/todo/" + id);
    }
    return (

        <div className="w-50 items-center border shadow-lg m-1" onClick={()=>handleNavigate(props.todoItem.id)}>
            {/* <Link className="flex items-center" to={`/todo/${props.todoItem.id}`}> */}
                <div className="mx-w-200 flex items-center m-2 p-2">
                    <input type="checkbox" className="w-6 h-6 checked:bg-blue-500 p-0 m-0" checked={props.todoItem.isCompleted}
                        onChange={() => { props.checkChanges(props.todoItem.id) }} />
                    <div className="w-full flex flex-col m-2 items-center ">
                        <h2 className="text-3xl   w-full flex justify-center">{props.todoItem.title}</h2>
                        <h4 className="text-2xl ">{props.todoItem.description}</h4>
                    </div>
                    <button className="bg-red-500 text-white rounded-xl p-2" onClick={() => { props.handleDelete(props.todoItem.id) }}>Delete</button>
                </div>
            {/* </Link> */}
        </div>
    );
}

export default TodoItem;
