import React, { useReducer } from "react";

type State = {
    firstCounter: number
};

type Action =
  | { type: "increment" ,value: number}
  | { type: "decrement" , value: number }
  | { type: "reset" , value: number };

const initialState: State = {
    firstCounter: 0
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "increment":
      return {firstCounter:state.firstCounter + action.value};
    case "decrement":
      return {firstCounter:state.firstCounter - action.value};
    case "reset":
      return initialState;
    default:
      return state;
  }
};

function CounterOne() {
  const [count, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <div>CounterOne</div>
      <div>
        <button type="button" onClick={() => dispatch({ type: "increment" ,value: 5})}>
          increment
        </button>
        <button type="button" onClick={() => dispatch({ type: "decrement" ,value: 5})}>
          decrement
        </button>
        <button type="button" onClick={() => dispatch({ type: "reset" , value:5})}>
          Reset
        </button>
        <div>Counter: {count.firstCounter}</div>
      </div>
    </div>
  );
}

export default CounterOne;
