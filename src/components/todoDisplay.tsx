import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import TodoItem from "./todoItem";

function TodoDisplay  () {
    const { id } = useParams();
    const { data: todoArr, ispending: pending, error } = useFetch("http://localhost:8000/todos/" + id);

    console.log("todo Array: ",todoArr);
    
    return (
        <div>
            {pending && <div>Wait a moment Data is Loading ...</div>}
            {error && <div>Error...</div>}
            {todoArr && todoArr.length > 0 && ( 
                <div>
                    in Todo Arr
                    <input type="checkbox" className="w-6 h-6 checked:bg-blue-500 p-0 m-0" checked={todoArr[0].isCompleted} />
                    <div className="w-full flex flex-col m-2 items-center bg-slate-500">
                        <h2 className="text-3xl text-white bg-slate-400 w-full flex justify-center">{todoArr[0].title}</h2>
                        <h4 className="text-2xl text-white">{todoArr[0].description}</h4>
                    </div>
                </div>
            )}
            loading...
        </div>
    );
};

export default TodoDisplay;
