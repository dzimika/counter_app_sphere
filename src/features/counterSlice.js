import { createSlice } from '@reduxjs/toolkit'; // Defines a slice of the Redux state

const counterSlice = createSlice({
    // I decided to create only one slice for both counter state and sphere state and named it 'counter' in general
    // The application is simple and doesn't need multiple slices
    name: 'counter',
    initialState: {
        count: 1,
        sphereRadius: 1,
        buttonClicks: 0
    },
    reducers: {
        // Increment and decrement are not used in the current version of the app
        increment(state) {
            state.count++;
        },
        decrement(state) {
            state.count--;
        },

        // Reducers for updating the initial states stored in the Redux store when there is no connection to the server
        setCount(state, action) {
            state.count = action.payload;
        },
        setRadius: (state, action) => {
            state.sphereRadius = action.payload;
        },
        // Reducer for updating the state of the variable buttonClicks
        // Keeps track of how many times each client has clicked on any of the two buttons
        updateButtonClicks(state) {
            state.buttonClicks += 1;
        },
    }
});

export const { increment, decrement, setCount, setRadius, updateButtonClicks } = counterSlice.actions; // Extracting action creators
export const selectSphereRadius = state => state.counter.sphereRadius; // Exporting the selector function
export default counterSlice.reducer; // Exporting the reducer function