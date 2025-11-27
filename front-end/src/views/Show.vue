<template>
    <div>
        <h1>Show Word</h1>                                                       <!-- Page heading: Show Word -->

        <div class="ui labeled input fluid">                                     <!-- German word display block -->
            <div class="ui label">
                <i class="germany flag"></i> German                              <!-- Label with German flag -->
            </div>
            <input type="text" readonly :value="word.german" />                  <!-- Read-only input showing the German word -->
        </div>

        <div class="ui labeled input fluid">                                     <!-- English word display block -->
            <div class="ui label">
                <i class="united kingdom flag"></i> English                      <!-- Label with UK flag -->
            </div>
            <input type="text" readonly :value="word.english" />                 <!-- Read-only input showing the English word -->
        </div>

        <div class="ui labeled input fluid">                                     <!-- Vietnamese word display block -->
            <div class="ui label">
                <i class="vietnam flag"></i>Vietnam                              <!-- Label with Vietnam flag -->
            </div>
            <input type="text" readonly :value="word.vietnamese" />              <!-- Read-only input showing the Vietnamese word -->
        </div>

        <div class="actions">                                                    <!-- Container for action links -->
            <router-link :to="{ name: 'edit', params: { id: this.$route.params.id } }">
                Edit word                                                        <!-- Link to the edit page, using current word's ID -->
            </router-link>
        </div>
    </div>
</template>
<script>
import { api } from '../helpers/helpers';                                        // Import API helper functions
export default {
    name: 'show',                                                                // Name of this Vue component

    data() {
        return {
            word: ''                                                             // Initialize word as an empty string (will be replaced with object data)
        };
    },

    async mounted() {                                                            // Lifecycle hook called when the component is mounted
        this.word = await api.getWord(this.$route.params.id);                   // Fetch the word from the API using the route's ID parameter
        //console.log(this.$route.params.id);                                   // Debug: uncomment to log the ID
    }
};
</script>
<style scoped>
.actions a {
    display: block;                                                              /* Display the link as a block element */
    text-decoration: underline;                                                 /* Underline the link */
    margin: 20px 10px;                                                           /* Add margin around the link */
}
</style>