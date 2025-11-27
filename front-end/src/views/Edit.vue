<template>
    <div>
        <h1>Edit Word</h1>                                               <!-- Page heading -->
        <word-form @createOrUpdate="createOrUpdate" :word="this.word"></word-form>  
        <!-- Use the WordForm component, passing in `word` as a prop and listening for the createOrUpdate event -->
    </div>
</template>
<script>
import WordForm from '../components/WordForm.vue';                      // Import the WordForm component
import { api } from '../helpers/helpers';                               // Import API helper functions
export default {
    name: 'edit',                                                       // Name of this Vue component
    components: {
        'word-form': WordForm                                           // Register WordForm component with alias 'word-form'
    },
    data: function () {
        return {
            word: {}                                                    // Initialize empty word object (will be filled when component is mounted)
        };
    },
    async mounted() {                                                   // Lifecycle hook: runs when component is mounted
        this.word = await api.getWord(this.$route.params.id);           // Fetch the word from API using the ID from the route params
    },
    methods: {
        createOrUpdate: async function (word) {                         // Method called when WordForm emits 'createOrUpdate' event
            await api.updateWord(word);                                 // Call API to update the word
            this.flash('Word updated successfully!', 'success');        // Show success flash message
            this.$router.push(`/words/${word._id}`);                    // Redirect to the detail page of the updated word
        }
    }
};
</script>