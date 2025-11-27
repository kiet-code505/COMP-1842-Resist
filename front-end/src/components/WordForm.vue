 <template>
    <form action="#" @submit.prevent="onSubmit">                   <!-- Form element with submit event prevented and handled by 'onSubmit' -->
        <p v-if="errorsPresent" class="error">Please fill out both fields!</p> <!-- Show error message if validation fails -->

        <div class="ui labeled input fluid">                       <!-- UI block for German input -->
            <div class="ui label">
                <i class="germany flag"></i> German                <!-- Label with German flag icon -->
            </div>
            <input type="text" placeholder="Enter word..." v-model="word.german" /> <!-- Two-way bind to word.german -->
        </div>

        <div class="ui labeled input fluid">                       <!-- UI block for English input -->
            <div class="ui label">
                <i class="united kingdom flag"></i> English        <!-- Label with UK flag icon -->
            </div>
            <input type="text" placeholder="Enter word..." v-model="word.english" />  <!-- Two-way bind to word.english -->
        </div>

        <div class="ui labeled input fluid">                       <!-- UI block for Vietnamese input -->
            <div class="ui label">
                <i class="vietnam flag"></i> Vietnam               <!-- Label with Vietnam flag icon -->
            </div>
            <input type="text" placeholder="Enter word..." v-model="word.vietnamese" /> <!-- Two-way bind to word.vietnamese -->
        </div>

        <button class="positive ui button">Submit</button>         <!-- Submit button -->
    </form>
</template>
<script>
export default {
    name: 'word-form',                                            // Name of the Vue component

    props: {                                                      // Define props received from the parent component
        word: {
            type: Object,                                         // Expect an object (with fields like english, german, etc.)
            required: false,                                      // It's optional
            default: () => {                                      // If not passed, use this default object
                return {
                    english: '',
                    german: '',
                    vietnamese: '',
                };
            }
        }
    },

    data() {
        return {
            errorsPresent: false                                  // Local state to track if validation errors exist
        };
    },
    
    methods: {
        onSubmit: function () {                                   // Method triggered on form submission
            if (this.word.english === '' || this.word.german === '') {
                this.errorsPresent = true;                        // If either field is empty, set error flag to true
            } else {
                this.$emit('createOrUpdate', this.word);          // Emit event with word object to parent component
            }
        }
    }
};
</script>