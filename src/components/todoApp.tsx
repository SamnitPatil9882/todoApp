import React, { useState, useEffect } from "react";
import Heading from "./heading";
import InputDiv from "./inputTodo";
import todoInfo from "../models/todoItem";
import useFetch from "../hooks/useFetch";
import TodoList from "./todoList";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TodoDisplay from "./todoDisplay";

function TodoApp() {
    const { data: todoArr, ispending: pending, error } = useFetch("http://localhost:8000/todos");

    const [todoList, setTodoList] = useState<todoInfo[]>([]);

    useEffect(() => {
        if (todoArr) {
            setTodoList(todoArr);
        }
    }, [todoArr]);

    const addTodoData = (title: string, description: string) => {
        if (title === "" || description === "") {
            return;
        }
        const id = Math.abs(Math.floor(Math.random() * Date.now()));
        const todo: todoInfo = { title, isCompleted: false, id, description };
        setTodoList(prevTodoList => [...prevTodoList, todo]);
    };

    const checkChanges = (id: number) => {
        setTodoList(prevTodoList => prevTodoList.map(todo => {
            if (todo.id === id) {
                return { ...todo, isCompleted: !todo.isCompleted };
            }
            return todo;
        }));
    };

    const handleDelete = (id: number) => {
        setTodoList(prevTodoList => prevTodoList.filter(todo => todo.id !== id));
    };

    return (
        <Router>
            <div className="h-screen w-screen mx-auto bg-slate-100  flex-col items-center ">

                <div className="bg-blue-500 flex">
                    <Heading />
                </div>
                <div className="content">
                    <Routes>
                        <Route path="/addtodo" element={<InputDiv addTodoData={addTodoData} />} />
                        <Route path="/" element={<div>
                            {pending && <div className="w-full flex flex-col items-center ">
                                Wait a moment
                                Data is loading...
                            </div>}
                            {error && <div className="w-full flex flex-col items-center ">
                                Something went wrong!
                            </div>}
                            {todoList && <TodoList todoList={todoList} checkChanges={checkChanges} handleDelete={handleDelete} />}
                        </div>} />
                        <Route path="/todo/:id" element={<TodoDisplay/>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default TodoApp;
