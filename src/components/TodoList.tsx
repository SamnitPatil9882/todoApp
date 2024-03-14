import todoInfo from "../models/todoItem";
import TodoItem from "./TodoItem";
function TodoList(props:{todoList: todoInfo[],checkChanges:(id:number,isCompleted:boolean)=> void,handleDelete:(id:number)=> void}){
    return(
        <div className="w-full flex flex-col items-center ">
            {props.todoList.map((todo,ind) =>(
                <TodoItem key={ind} todoItem={todo} checkChanges={props.checkChanges} handleDelete={props.handleDelete}/>
            ))}
        </div>
    )
}
export default TodoList;





