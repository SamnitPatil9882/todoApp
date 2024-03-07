import React, { useState } from "react";

function Normaluserform(){
    const [error,setError] = useState("")
    const handleSubmit =(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        console.log("in form");
        const formData = new FormData(e.currentTarget)
        formData.forEach((value,key)=>{
            console.log(value);
        }) 
    }

    const handleNameChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        console.log("input name: ",e.target.value); 
        if(e.target.value.length>4){
            setError("value must not be greater than 4 characters")
        }
        else{
            setError("")
        }
    }   
    
    return (
        <form className="flex flex-col items-center p-2 border-2" onSubmit={(e)=>{handleSubmit(e)} }>
            
            <div  className="flex flex-col items-center p-2 border-2">
            <input className="border-2" type="text" name="username" placeholder="username" onChange={(e)=>{handleNameChange(e)}}/>
            <>{error}</>
            <input className="border-2" type="text" name="mobile" placeholder="mobile"/>
            <button type="submit">Submit</button>
            </div>
        </form>
    )
}
export default  Normaluserform ;