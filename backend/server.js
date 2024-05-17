// Importing core Node.js module
const { createServer } = require('http');
// Websocket implementation for Node.js
// Documentation: https://www.npmjs.com/package/ws
const { WebSocket } = require('ws');
// A library for implementing the JSON-RPC 2.0
// Documentation: https://www.npmjs.com/package/json-rpc-2.0
const { JSONRPCServer } = require('json-rpc-2.0');

// Creating an instance of JSONRPC Server for handling JSON-RPC requests
const rpcServer = new JSONRPCServer();

// Initializing variables to hold the current states
let sphereRadius = 1;
let counter = 1;

// Maintaining the list of WebSocket connections
const clients = new Set();

//JSON-RPC method that returns the current value of the counter variable
rpcServer.addMethod('get_count', () => {
    return counter;
});
//JSON-RPC method that returns the current value of the sphereRadius variable
rpcServer.addMethod('get_radius', () => {
    return sphereRadius;
});

//JSON-RPC method that accepts a parameter 'radius' to set the 'sphereRadius' and broadcast it to all connected clients
rpcServer.addMethod('set_radius', (radius) => {
    console.log('Received set_radius request with radius:', radius);
    sphereRadius = radius;
    console.log('Updated sphereRadius to:', sphereRadius);
    broadcast({
        jsonrpc: '2.0',
        method: 'update_radius',
        params: [radius],
    });
    return 'Success';
});

//JSON-RPC method that increments the value of the counter and broadcasts the updated value to all connected clients
rpcServer.addMethod('increment', () => {
    counter++;
    broadcast({ count: counter }); // Broadcast updated count
    return counter;
});

//JSON-RPC method that decrements the value of the counter and broadcasts the updated value to all connected clients
rpcServer.addMethod('decrement', () => {
    counter--;
    broadcast({ count: counter }); // Broadcast updated count
    return counter;
});

// Initializing new WebSocet server
const wss = new WebSocket.Server({ noServer: true });

// Event handler fpr handling new WebSocket connections
wss.on('connection', function connection(ws) {
    clients.add(ws); // Add the new WebSocket connection to the set
    
    // When a client connects it listens for messages from the client
    ws.on('message', async function incoming(message) {
        console.log('Received message:', message);
        // Parsing incoming JSON-RPC rewuests
        const request = JSON.parse(message);
        try {
            // Processing the requests
            // Documentation: https://www.npmjs.com/package/json-rpc-2.0 
            const result = await rpcServer.receive(request);

            console.log('Result:', result);

            // Broadcast the new counter value to all connected clients
            broadcast(result);
        } catch (error) {
            ws.send(JSON.stringify({ error: error.message }));
        }
    });

    // Remove the WebSocket connection from the set when it's closed
    ws.on('close', () => {
        clients.delete(ws);
    });
});

// Setting up HTTP server to handle WebSocket upgrades
const server = createServer();
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// This function is used to send data to all connected WebSocket clients
// This way clients are interacting with the application simultaniously
function broadcast(data) {
    // Check the type of data being broadcasted
    if (typeof data === 'object') {
        // If data is an object, stringify it
        data = JSON.stringify(data);
    }

    // Broadcast the data to all connected clients (clients in the 'OPEN' state)
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}
// Server is set to listen on port '3001'
const PORT = 3001;
// Checking if the server is running on the specified port
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
