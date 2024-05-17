import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCount, setRadius, updateButtonClicks } from './features/counterSlice';
import './index.css'; // Importing Tailwind styles
import ThreeScene from './ThreeScene'; // Importing the Three.js scene

const App = () => {
    // Using the useSelector hook to extract count and buttonClicks state values from the Redux store's state
    // These are used for tracking the button clicks locally for each client and for initial counter state when not connected to the server
    const count = useSelector((state) => state.counter.count);
    const buttonClicks = useSelector((state) => state.counter.buttonClicks)
    // Retrieves the dispatch function from the Redux store
    const dispatch = useDispatch();
    // Managing the state of WebSocket asynchronious connections with useState hook
    // Documentation: https://react.dev/reference/react/hooks
    const [socket, setSocket] = useState(null);
    const [radiusInput, setRadiusInput] = useState('');

    // WebSocket initialization and event handling
    // Documentation: https://websockets.spec.whatwg.org// , https://developer.mozilla.org/en-US/docs/Web/API/WebSocket 
    // JSONRPC2.0 Documentation: JSON-RPC 2.0 Specification 
    useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:3001');

        // Defining event handlers for the WebSocket open and message events to communicate with the server
        newSocket.onopen = () => {
            // Transmitting data to the server - it sends a JSON string representing a JSON-RPC request to the server.
            // JSON.stringify serializes the object so that it can be transmitted over the WebSocket connection
            newSocket.send(JSON.stringify({
                jsonrpc: '2.0',
                method: 'get_count',
                id: 1,
            }));
        };

        // In case of receiving the massage from the server
        newSocket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            console.log('Received response:', response);
            // Including response.result !== 'Success' was a solution to the problem where the counter value was updating with the result value 'Success'
            if (response.result && response.result !== 'Success') {
                dispatch(setCount(response.result));
            } else if (response.error) {
                console.error('Error:', response.error);
            // For updating only the radius
            } else if (response.params) {
                const radius = Array.isArray(response.params) ? response.params[0] : response.params;
                if (response.method === 'update_radius') {
                    dispatch(setRadius(radius));
                }
            }
        };

        // The setSocket function is called to update the state with the new WebSocket object.
        setSocket(newSocket);

        // Cleanup function
        return () => {
            newSocket.close();
        };
    }, [dispatch]); // Dispatch might change if it's memoized by Redux, or if it's overridden by a new function due to a store update.

    // These handlers send corresponding JSON-RPC requests to the server and dispatch the updateButtonClicks Redux action to track button clicks for each client.
    const handleIncrement = () => {
        if (socket) {
            socket.send(JSON.stringify({
                jsonrpc: '2.0',
                method: 'increment',
                id: 1,
            }));
            dispatch(updateButtonClicks()); // Track button click
        }
    };
    const handleDecrement = () => {
        if (socket) {
            socket.send(JSON.stringify({
                jsonrpc: '2.0',
                method: 'decrement',
                id: 1,
            }));
            dispatch(updateButtonClicks()); // Track button click
        }
    };

    // Dispatches the setRadius action to update the sphere radius in the Redux store and sends a corresponding JSON-RPC request to the server via WebSocket.
    const handleSetRadius = () => {
        const newRadius = parseFloat(radiusInput); // Parses the input line's string into a floating-point number
        // Creating the condition for the input line that the input can only be numbers between 1 and 4
        if (isNaN(newRadius) || newRadius < 1 || newRadius > 4) {
            alert('Input only accepts numbers between 1 and 4');
            return;
        }
        // Updates the radius in the Redux store
        dispatch(setRadius(newRadius));
        // Sending JSON-RPC request to the server to update the radius with the new value
        if (socket) {
            socket.send(JSON.stringify({
                jsonrpc: '2.0',
                method: 'set_radius',
                params: [newRadius],
                id: 1,
            }));
        }
    };

    const handleRadiusInputChange = (event) => {
        // Ensures that only valid numerical input is accepted
        if (/^[0-9.]*$/.test(event.target.value)) {
            // Updating the state variable radiusInput with the new value entered by the user
            setRadiusInput(event.target.value);
        }
    };

    // I decided for a simple and responsive design
    // I used Tailwindcss per instructions for styling; re-usable styles can be found inside 'index.css'
    // Documentation: https://tailwindcss.com/docs/background-color
    // I decided to add another functionality outside of instructions - A counter that tracks how many times each client has clicked any of the buttons per session and the state is managed with Redux
    return (
        <div className="container mx-auto p-8">
            <div className="container-style p-8">
                <h1 className="header-style">Counter</h1>
                <div className="flex items-center mb-4">
                    <p className="othertext-style">Count:</p>
                    <div className="count-box">
                        <span className="font-bold font-button">{count}</span>
                    </div>
                </div>
                <div className="space-x-4">
                    <button 
                        className="btn-blue font-button"
                        onClick={handleIncrement}
                    >
                        Increment
                    </button>
                    <button 
                        className="btn-red font-button"
                        onClick={handleDecrement}
                    >
                        Decrement
                    </button>
                </div>
                <div className="flex items-center">
                    <p className="othertext-style">You have clicked on the buttons this many times:</p>
                    <div className="count-box">
                        <span className="font-bold font-button">{buttonClicks}</span>
                    </div>
                </div>
            </div>

            <div className="container-style">
                <h2 className="header-style p-8">The Sphere</h2>
                <div className="flex flex-col items-center justify-center p-8">
                    <ThreeScene radius={1} />
                    <div className="flex items-center mt-4">
                        <input
                            type="number"
                            value={radiusInput}
                            onChange={handleRadiusInputChange}
                            placeholder="Enter radius"
                            className="input-field mr-2 font-button"
                        />
                        <button
                            className="btn-green font-button"
                            onClick={handleSetRadius}
                        >
                            Set Radius
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
