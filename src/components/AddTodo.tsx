import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import { useFormik } from "formik";

import { postTodo, getCurrentDateString } from "../utilityFunctions";

const initialValues = {
  title: "",
  date: new Date(),
  description: "",
};

function AddTodo() {
  const queryClient = useQueryClient();

  const { mutate, error } = useMutation({
    mutationFn: postTodo,
    mutationKey: ["postTodos"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todosData"],
        exact: true,
      });
    },
  });

  const validationSchema = Yup.object({
    title: Yup.string().max(10, "max value 10").required("Title is required"),
    date: Yup.date()
      .min(new Date(), "date is not valid")
      .required("Date is required"),
    description: Yup.string()
      .max(10, "max value 10")
      .required("Description is required"),
  });

  const {
    handleChange,
    handleSubmit,
    values,
    isSubmitting,
    errors,
    handleBlur,
    handleReset,
    
  } = useFormik({
    initialValues,
    onSubmit: (values) => {
      
      const isCompleted = false;
      mutate({
        title: values.title,
        isCompleted: false,
        selectedDate: values.date,
        description: values.description,
      });
    },
    validationSchema,
  });

  return (
    <div className="h-25 container-lg mx-auto bg-slate-800 flex justify-center items-center">
      <form className="flex flex-col items-center" onSubmit={handleSubmit}>
        <label htmlFor="title" className="sr-only">
          Enter Todo Title
        </label>
        <input
          id="title"
          type="text"
          required
          placeholder="Enter Todo Title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          className="placeholder-italic placeholder-slate-400 text-black rounded-md h-10 p-2 w-full m-2"
        />
        <div className="text-white">{errors.title}</div>

        <label htmlFor="date" className="sr-only">
          Select Todo Date
        </label>
        <input
          id="date"
          type="date"
          required
          value={values.date.toString()}
          onChange={handleChange}
          onBlur={handleBlur}
          className="placeholder-italic placeholder-slate-400 text-black rounded-md h-10 p-2 w-full m-2"
        />
        {errors.date && (
          <div className="text-white">{errors.date as string}</div>
        )}

        <label htmlFor="description" className="sr-only">
          Enter Todo Description
        </label>
        <input
          id="description"
          type="text"
          required
          placeholder="Enter Todo Description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          className="placeholder-italic placeholder-slate-400 text-black rounded-md h-10 p-2 w-full m-2"
        />
        <div className="text-white">{errors.description}</div>
        {isSubmitting && (
          <div className="text-green-500">Submitted data successfully
          <button
          type="button"
          className="w-20 m-2 bg-red-400 rounded-md h-10 p-2 ml-2"
          onClick={handleReset} // Use handleReset to reset the form
        >
          Reset
        </button>
          </div>
        )}
        {errors && error && (
          <div className="text-red-500">Internal Server Error</div>
        )}
        <button
          type="submit"
          className="w-20 m-2 bg-green-400 rounded-md h-10 p-2 ml-2"
        >
          + Todo
        </button>
        
      </form>
    </div>
  );
}

export default AddTodo;
