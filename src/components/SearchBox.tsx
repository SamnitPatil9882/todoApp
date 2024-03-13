import React, { useState, ChangeEvent } from "react";
import ascending from "../assets/asc.png";
import descending from "../assets/desc.png";
import { Order, DropdownFilter } from "../models/todoItem";
import {getCurrentDateString} from "../utilityFunctions"
function SearchBox({
  handleSearchChange,
  handleOrderChange,
  order,
  selectedOption,
  handleDropdownChange,
  // filteredDate,
  // setFilteredDate,
  handleFilterDateChange
}: {
  handleSearchChange: Function;
  handleOrderChange: Function;
  order: Order;
  selectedOption: DropdownFilter;
  handleDropdownChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  // filteredDate:Date;
  // // setFilteredDate:Function;
  handleFilterDateChange: (event: ChangeEvent<HTMLInputElement>) => void;

  
}) {
  
  return (
    <div className="flex items-center ">
      <input
        type="search"
        placeholder="Search by todo title"
        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 mr-2 focus:outline-none focus:bg-white focus:border-purple-500"
        onChange={(e) => {
          handleSearchChange(e, false);
        }}
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Search
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={(e) => handleOrderChange(false)}
      >
        {order == Order.asc ? (
          <img className="w-5" src={ascending} alt="Ascending" />
        ) : (
          <img className="w-5" src={descending} alt="Descending" />
        )}
      </button>
      <div className="ml-2 w-5">
        <select value={selectedOption} onChange={handleDropdownChange}>
          <option value="title">{DropdownFilter.title}</option>
          <option value="date">{DropdownFilter.date}</option>
        </select>
      </div>
      <div>
      <input
          id="date"
          type="date"
          required
          // value={filteredDate}
          onChange={handleFilterDateChange}
          min={getCurrentDateString()}
          className="placeholder-italic placeholder-slate-400 text-black rounded-md h-10 p-2 w-full m-2"
        />
      </div>
    </div>
  );
}

export default SearchBox;
