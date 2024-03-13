import { Link } from "react-router-dom";

export default function Heading() {
    return (
        <div className="container-lg mx-auto h-13 bg-blue-00 flex-col justify-center items-center ">
            {/* <h1 className="text-white text-4xl m-6 ">Todo App</h1> */}
            <nav className="navbar flex flex-row justify-center w-full  m-2 ">
                <h1 className="text-white text-4xl m-6 ">Todo App</h1>
                <Link to="/">
                    <div className="p-5 text-white text-2xl m-2 rounded-lg">
                        Todo List
                    </div>
                </Link>
                <Link to="/addtodo">
                    <div className="p-5 text-white  text-2xl m-2 rounded-lg">
                        Add todo
                    </div>
                </Link>
            </nav>
        </div>
    )
}
