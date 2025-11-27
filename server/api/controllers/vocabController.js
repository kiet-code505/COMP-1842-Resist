const mongoose = require('mongoose');// Import Mongoose to interact with MongoDB
const Vocab = mongoose.model('Vocab');// Get the 'Vocab' model that was registered earlier using the schema
exports.list_all_words = (req, res) => { // Export a function to list all vocabulary words
    Vocab.find({}, (err, words) => {   // Use Mongoose to find all documents in the 'vocab' collection
        if (err) res.send(err);// If there's an error, send it in the response
        res.json(words);// Otherwise, return all words as a JSON array
    });
};
exports.create_a_word = (req, res) => { // Export a function to create a new vocabulary word
    console.log(req.body);// Log the request body (for debugging purposes)
    const newWord = new Vocab(req.body);// Create a new instance of the Vocab model using data from the request body
    newWord.save((err, word) => { // Save the new word to the database
        if (err) res.send(err);   // If there's an error, send it
        res.json(word);  // Otherwise, return the saved word as JSON
    });
};
exports.read_a_word = (req, res) => { // Export a function to get a single word by ID
    Vocab.findById(req.params.wordId, (err, word) => { // Use Mongoose to find a word by its ID (from route params)
        if (err) res.send(err); // If error, send it
        res.json(word); // Otherwise, return the word as JSON
    });
};
exports.update_a_word = (req, res) => { // Export a function to update a word by ID
    Vocab.findOneAndUpdate( // Use Mongoose to find and update the word
        { _id: req.params.wordId }, // Find the word by its ID
        req.body,  // Update it with data from the request body
        { new: true }, // Return the updated document (not the original)
        (err, word) => {
            if (err) res.send(err); // If error, send it
            res.json(word); // Otherwise, return the updated word
        }
    );
};
exports.delete_a_word = (req, res) => { // Export a function to delete a word by ID
    Vocab.deleteOne({ _id: req.params.wordId }, err => { // Use Mongoose to delete the document by ID
        if (err) res.send(err); // If error, send it
        res.json({  // Otherwise, send a success message
            message: 'Word successfully deleted',
            _id: req.params.wordId // Include the deleted word's ID in the response
        });
    });
};