import todoInfo from "../models/todoItem";
import TodoItem from "./todoItem";
function TodoList(props:{todoList: todoInfo[],checkChanges:(id:number)=> void,handleDelete:(id:number)=> void}){
    return(
        <div className="w-full flex flex-col items-center ">
            {props.todoList.map((todo) =>(
                <TodoItem todoItem={todo} checkChanges={props.checkChanges} handleDelete={props.handleDelete}/>
            ))}
        </div>
    )
}
export default TodoList;