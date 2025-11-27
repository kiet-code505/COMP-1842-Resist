<template>
    <div>
        <h1>New Word</h1>                                               <!-- Page heading: New Word -->
        <word-form @createOrUpdate="createOrUpdate"></word-form>       <!-- Use WordForm component and listen for createOrUpdate event -->
    </div>
</template>
<script>
import WordForm from '../components/WordForm.vue';                      // Import the WordForm component
import { api } from '../helpers/helpers';                               // Import API helper functions from helpers.js
export default {
    name: 'new-word',                                                   // Name of this Vue component
    components: {
        'word-form': WordForm                                           // Register the WordForm component for use in this component
    },
    methods: {
        createOrUpdate: async function (word) {                         // Method triggered when the form emits 'createOrUpdate'
            const res = await api.createWord(word);                     // Call the API to create a new word and wait for the response
            this.flash('Word created', 'success');                      // Show a success message using flash
            this.$router.push(`/words/${res._id}`);                     // Redirect to the detail page of the newly created word
        }
    }
};
</script>