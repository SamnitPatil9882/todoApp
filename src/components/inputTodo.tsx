import React, { useState } from "react";

function InputDiv({ addTodoData }: { addTodoData: (title: string, description: string) => void }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        addTodoData(title, description);
        setTitle("");
        setDescription("");
        setIsSubmitting(false);
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

                {isSubmitting && <div className="text-green-500">Submitting data...</div>}

                <button type="submit" className="w-20 m-2 bg-green-400 rounded-md h-10 p-2 ml-2">+ Todo</button>
            </form>
        </div>
    )
}

export default InputDiv;
