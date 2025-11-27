const mongoose = require('mongoose'); // Import the Mongoose library to interact with MongoDB

const Schema = mongoose.Schema; // Create a shortcut to the Mongoose Schema constructor

const VocabSchema = new Schema(  // Define a new Mongoose Schema named VocabSchema
    {
        english: {   // Define the 'english' field
            type: String,  // The data type must be a string
            required: 'English word cannot be blank' // Validation: this field is required, with a custom error message
        },
        german: {   // Define the 'german' field
            type: String,  // The data type must be a string
            required: 'German word cannot be blank' // Validation: this field is required, with a custom error message
        },
        vietnamese: {  // Define the 'vietnamese' field
            type: String,  // The data type must be a string
            required: 'vietnamese word cannot be blank' // Validation: this field is required, with a custom error message
        }
    },
    { collection: 'vocab' }  // Optional: explicitly specify the name of the MongoDB collection as 'vocab'
);
module.exports = mongoose.model('Vocab', VocabSchema); // Export the model 'Vocab' based on the schema, making it available for use elsewhere