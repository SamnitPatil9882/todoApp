import React, { useEffect, useState } from "react";

function InputDiv({ addTodoData }: { addTodoData: (title: string, description: string) => void }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmited, setIsSubmited] = useState(false);
    const [error, setError] = useState<string>("")

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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetch("http://localhost:8000/todos",
            {
                method: "POST",
                body: JSON.stringify({
                    title,
                    description,
                }),
            }
        )
            .then(response => response.json())
            .then(response => {
                console.log(response);
                setError("");
                setIsSubmited(true)
            })
            .catch(error => setError(error))

        
        addTodoData(title, description);
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

export default InputDiv;
