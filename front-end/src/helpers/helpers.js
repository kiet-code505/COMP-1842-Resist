import axios from 'axios';// Import Axios for making HTTP requests
import Vue from 'vue';// Import Vue framework
import VueFlashMessage from 'vue-flash-message';// Import the flash message plugin for showing alerts
import 'vue-flash-message/dist/vue-flash-message.min.css';// Import the CSS for flash messages
Vue.use(VueFlashMessage, {// Register the flash message plugin with Vue
    messageOptions: {
        timeout: 3000,// Each message disappears after 3 seconds
        pauseOnInteract: true// Pause the timeout if the user interacts with the message
    }
});
const vm = new Vue();// Create a temporary Vue instance to use flash messages outside components
const baseURL = 'http://localhost:3000/words/';// Define the base URL for the API endpoint
const handleError = fn => (...params) => {// Higher-order function to wrap async functions and catch errors
    return fn(...params).catch(error => {// Catch any errors thrown in the async function
        vm.flash(`${error.response.status}: ${error.response.statusText}`, 'error');// Show an error flash message with HTTP status
    });
};
export const api = {
    getWord: handleError(async id => {// Get a single word by its ID
        const res = await axios.get(baseURL + id);// Make GET request to /words/:id
        console.log(res);// Log response for debugging
        return res.data;// Return the data
    }),
    getWords: handleError(async () => {// Get all words
        const res = await axios.get(baseURL);// Make GET request to /words/
        console.log(res);// Log response
        return res.data;// Return the array of words
    }),
    deleteWord: handleError(async id => {// Delete a word by its ID
        const res = await axios.delete(baseURL + id);// Make DELETE request to /words/:id
        return res.data;// Return confirmation message
    }),
    createWord: handleError(async payload => { // Create a new word
        console.log('payload:', payload);// Log the payload being sent
        const res = await axios.post(baseURL, payload);// Make POST request to /words/ with payload
        return res.data;// Return the newly created word
    }),
    updateWord: handleError(async payload => { // Update an existing word
        const res = await axios.put(baseURL + payload._id, payload); // Make PUT request to /words/:id with updated data
        return res.data;// Return the updated word
    })
};