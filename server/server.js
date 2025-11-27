// Load environment variables silently 
const originalConsoleLog = console.log;
console.log = () => {}; // Temporarily disable console.log
require('dotenv').config();
console.log = originalConsoleLog; // Restore console.log
const express = require('express');                      // Import the Express library to create the server and handle routing
const cors = require('cors');                            // Import the CORS middleware to allow cross-origin requests
const mongoose = require('mongoose');                    // Import Mongoose to interact with MongoDB
const bodyParser = require('body-parser');               // Import body-parser to parse incoming request bodies

global.Vocab = require('./api/models/vocabModel');       // Load the data model (Schema) from vocabModel.js and assign it to the global variable 'Vocab'
const routes = require('./api/routes/vocabRoutes');      // Import the API routes from vocabRoutes.js
const authRoutes = require('./api/routes/authRoutes');   // Import the authentication routes

mongoose.Promise = global.Promise;                       // Set Mongoose to use Node.js's native Promise implementation
mongoose.connect(                                         
    'mongodb+srv://kietpggcs230033:19112005@cluster01.d7gdbfu.mongodb.net/vocab-builder-v2?retryWrites=true&w=majority&appName=Cluster01', 
    { useNewUrlParser: true }                            // Connect to MongoDB Atlas using the connection string; useNewUrlParser avoids deprecation warnings
);

const port = process.env.PORT || 3000;                   // Define the port to run the server on, using an environment variable if available
const app = express();                                   // Create a new Express application

app.use(cors());                                         // Enable CORS for all incoming requests
app.use(bodyParser.urlencoded({ extended: true }));      // Parse URL-encoded bodies (typically from HTML forms)
app.use(bodyParser.json());                              // Parse JSON bodies (typically from API clients)

routes(app);                                             // Attach the imported routes to the Express app
authRoutes(app);                                         // Attach the authentication routes to the Express app

app.listen(port);                                        // Start the server and have it listen on the defined port
app.use((req, res) => {                                  // Middleware to handle undefined routes
    res.status(404).send({ url: `${req.originalUrl} not found` });  // Return a 404 error for unrecognized endpoints
});

console.log(`Server started on port ${port}`);           // Log a message indicating the server has started