module.exports = function (app) { // Export a function that takes an Express app instance as a parameter
    const vocabController = require('../controllers/vocabController'); // Import the vocabController module that contains handler functions

    app.route('/words')  // Define the route for '/words'
        .get(vocabController.list_all_words) // Handle GET requests to list all vocabulary words
        .post(vocabController.create_a_word); // Handle POST requests to create a new vocabulary word

    app.route('/words/:wordId') // Define the route for a specific word by ID (dynamic route parameter)
        .get(vocabController.read_a_word) // Handle GET requests to retrieve a single word by ID
        .put(vocabController.update_a_word) // Handle PUT requests to update a word by ID
        .delete(vocabController.delete_a_word); // Handle DELETE requests to remove a word by ID
};