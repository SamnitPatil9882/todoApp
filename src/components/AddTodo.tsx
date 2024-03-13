import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {getCurrentDateString} from "../utilityFunctions"
function AddTodo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmited, setIsSubmited] = useState(false);
    const [error, setError] = useState<string>("")
    const [selectedDate, setDate] = useState("")

    const navigate = useNavigate()
    
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
        setIsSubmited(false)
        setError("")
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
        setIsSubmited(false)
        setError("")
    }

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDate(event.target.value);
        console.log(event.target.value);
        console.log(new Date(event.target.value));
        
    }


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetch("http://localhost:8000/todos",
            {
                method: "POST",
                body: JSON.stringify({
                    title,
                    description,
                    selectedDate,
                }),
            }
        )
            .then(response => response.json())
            .then(response => {
                console.log(response);
                setError("");
                setIsSubmited(true);
                navigate("/");
            })
            .catch(error => setError(error))


        // addTodoData(title, description);
        setTitle("");
        setDescription("");
    }

    
    return (
        <div className="h-25 container-lg mx-auto bg-slate-800 flex justify-center items-center">
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                <label htmlFor="title" className="sr-only">Enter Todo Title</label>
                <input
                    id="title"
                    type="text"
                    required
                    placeholder="Enter Todo Title"
                    value={title}
                    onChange={handleTitleChange}
                    className="placeholder-italic placeholder-slate-400 text-black rounded-md h-10 p-2 w-full m-2"
                />

                <label htmlFor="description" className="sr-only">Enter Todo Description</label>
                <input
                    id="date"
                    type="date"
                    required
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={getCurrentDateString()}
                    className="placeholder-italic placeholder-slate-400 text-black rounded-md h-10 p-2 w-full m-2"
                />
                <input
                    id="description"
                    type="text"
                    required
                    placeholder="Enter Todo Description"
                    value={description}
                    onChange={handleDescriptionChange}
                    className="placeholder-italic placeholder-slate-400 text-black rounded-md h-10 p-2 w-full m-2"
                />
                {isSubmited && <div className="text-green-500">Submited data successfully</div>}
                {error && <div className="text-red-500"   >Internal Server Error</div>}
                <button type="submit" className="w-20 m-2 bg-green-400 rounded-md h-10 p-2 ml-2">+ Todo</button>

            </form>
        </div>
    )
}

export default AddTodo;
