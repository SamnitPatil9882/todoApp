import React, { useEffect, useReducer } from 'react';
import axios from 'axios';

interface State {
    loading: boolean;
    error: string;
    post: any; // Adjust the type according to your actual post structure
}

type Action =
    | { type: 'FETCH_SUCCESS'; payload: any } // Adjust payload type according to your actual post structure
    | { type: 'FETCH_ERROR' };

const initialState: State = {
    loading: true,
    error: '',
    post: {},
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return {
                loading: false,
                post: action.payload,
                error: '',
            };
        case 'FETCH_ERROR':
            return {
                loading: false,
                error: 'something went wrong',
                post: {},
            };
        default:
            return state;
    }
};

function DataFetching() {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/posts/1')
            .then(response => {
                dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
            })
            .catch(error => {
                dispatch({ type: 'FETCH_ERROR' });
            });
    }, []);

    return (
        <div>
            <div>DataFetching</div>
            {state.loading && <div>Loading...</div>}
            {state.error && <div>{state.error}</div>}
            {state.post && (
                <div>
                    <h2>{state.post.title}</h2>
                    <div>{state.post.body}</div>
                </div>
            )}
        </div>
    );
}

export default DataFetching;
