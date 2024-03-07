import React from "react";
import {useFormik} from "formik";
import * as Yup from "yup";

const initialValues = {
    userName:"",
    mobile:"",
}
function FomikForm(){
    const {handleChange,handleSubmit,values,errors,handleBlur,handleReset}  = useFormik({
        initialValues:initialValues,
        onSubmit:(value)=>{
            // console.log(value);
            
        }
        ,validationSchema:Yup.object({
            userName:Yup.string().max(4,"max value 4").required("username is required"),
            mobile:Yup.string().required("mobile is required"),
        })
    })
    console.log("values: ",values);
    
    return(
        <form className="flex flex-col items-center p-2 border-2" onSubmit={handleSubmit } >
            <div  className="flex flex-col items-center p-2 border-2">
            <input className="border-2" type="text" name="userName" placeholder="userName" onChange={handleChange} onBlur={handleBlur}/>
            <>{errors.userName}</>
            <input className="border-2" type="text" name="mobile" placeholder="mobile" onChange={handleChange}/>
            <button type="submit">Submit</button>
            <button type= "reset" onClick={handleReset}>Reset</button>
            </div>
        </form>
    )
}
export default  FomikForm ;