<template>
    <div class="words">                                                              <!-- Main container with class "words" -->
        <table class="ui celled compact table">                                      <!-- Semantic UI styled table -->
            <thead>
                <tr>
                    <th>English</th>                                                 <!-- Table header for English -->
                    <th>German</th>                                                  <!-- Table header for German -->
                    <th>Vietnamese</th>                                              <!-- Table header for Vietnamese -->
                    <th colspan="3"></th>                                            <!-- Empty header for action buttons (Show/Edit/Delete) -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="(word, i) in words" :key="i">                              <!-- Loop through 'words' array and render each word -->
                    <td>{{ word.english }}</td>                                      <!-- Display English word -->
                    <td>{{ word.german }}</td>                                       <!-- Display German word -->
                    <td>{{ word.vietnamese }}</td>                                   <!-- Display Vietnamese word -->

                    <td width="75" class="center aligned">                           <!-- Action cell: Show -->
                        <router-link :to="{ name: 'show', params: { id: word._id } }">Show</router-link> 
                    </td>

                    <td width="75" class="center aligned">                           <!-- Action cell: Edit -->
                        <router-link :to="{ name: 'edit', params: { id: word._id } }">Edit</router-link>
                    </td>

                    <td width="75" class="center aligned" @click.prevent="onDestroy(word._id)"> <!-- Action cell: Delete -->
                        <a :href="`/words/${word._id}`">Destroy</a>                  <!-- Prevents default link behavior, triggers delete -->
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import { api } from '../helpers/helpers';                                            // Import API methods
export default {
    name: 'words',                                                                  // Name of the component
    data() {
        return {
            words: []                                                               // Initialize words array to hold list of vocabulary
        };
    },
    methods: {
        async onDestroy(id) {                                                       // Method to delete a word by ID
            const sure = confirm('Are you sure?');                                  // Confirm with user before deleting
            if (!sure) return;                                                      // Cancel if user doesn't confirm

            await api.deleteWord(id);                                               // Call API to delete the word
            this.flash('Word deleted successfully!', 'success');                    // Show success message
            const newWords = this.words.filter(word => word._id !== id);            // Filter out the deleted word from the list
            this.words = newWords;                                                  // Update the words array in UI
        }
    }, 
    async mounted() {                                                               // Lifecycle hook: runs after the component is mounted
        this.words = await api.getWords();                                          // Fetch all words from the API
        //console.log(this.words);                                                  // Debug: log fetched data
    }
};
</script>