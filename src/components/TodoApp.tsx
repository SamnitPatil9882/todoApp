import React, { useState, useEffect } from "react";
import Heading from "./Heading";
import AddTodo from "./AddTodo";
import todoInfo from "../models/todoItem";
import useFetch from "../hooks/useFetch";
import TodoList from "./TodoList";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TodoDisplay from "./TodoDisplay";
import TodoStart from "./TodoStart";

function TodoApp() {
    return (
        <Router>
            <div className="h-screen w-screen mx-auto bg-slate-100  flex-col items-center ">

                <div className="bg-blue-900 flex">
                    <Heading />
                </div>
                <div className="content">
                    <Routes>
                        <Route path="/addtodo" element={<AddTodo />} />
                        <Route path="/" element={<TodoStart/>}/>
                        <Route path="/todo/:id" element={<TodoDisplay />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default TodoApp;
