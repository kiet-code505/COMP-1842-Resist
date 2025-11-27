<template>
    <div id="app">                                                           <!-- Root element of the app -->

        <!-- Main navigation bar using Semantic UI classes -->
        <div class="ui inverted segment navbar">                             <!-- Inverted color navbar using Semantic UI -->
            <div class="ui center aligned container">                        <!-- Center-aligned container for the menu -->
                <div class="ui large secondary inverted pointing menu compact"> <!-- Compact, large, inverted menu with pointing style -->

                    <!-- Router link for "Words" -->
                    <router-link to="/words" exact class="item">            <!-- Link to "/words" page -->
                        <i class="book icon"></i> Words                     <!-- Icon and label -->
                    </router-link>

                    <!-- Router link for "New" (only show if authenticated) -->
                    <router-link v-if="isLoggedIn" to="/words/new" class="item">  <!-- Link to create a new word -->
                        <i class="plus circle icon"></i> New                <!-- Icon and label -->
                    </router-link>

                    <!-- Right side menu -->
                    <div class="right menu">
                        <!-- User menu (if logged in) -->
                        <div v-if="isLoggedIn" class="ui dropdown item">
                            <i class="user icon"></i>
                            {{ currentUser }}
                            <i class="dropdown icon"></i>
                            <div class="menu">
                                <div class="item" @click="handleLogout">
                                    <i class="sign out icon"></i>
                                    Logout
                                </div>
                            </div>
                        </div>

                        <!-- Login/Register links (if not logged in) -->
                        <template v-else>
                            <router-link to="/login" class="item">
                                <i class="sign in icon"></i> Login
                            </router-link>
                            <router-link to="/register" class="item">
                                <i class="user plus icon"></i> Register
                            </router-link>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main content container for views -->
        <div class="ui text container">                                      <!-- Text container using Semantic UI -->

            <flash-message class="myFlash"></flash-message>                 <!-- Flash message component for showing notifications -->

            <div class="ui one column grid">                                 <!-- Grid with one column -->
                <div class="column">
                    <!-- Router view where components will be rendered based on the route -->
                    <router-view></router-view>                             <!-- This is where page components will appear -->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { isAuthenticated, getUserDisplayName, clearAuthData } from './helpers/auth';

export default {
    name: 'app',
    data() {
        return {
            isLoggedIn: false,
            currentUser: ''
        };
    },
    methods: {
        /**
         * Check authentication status
         */
        checkAuth() {
            this.isLoggedIn = isAuthenticated();
            if (this.isLoggedIn) {
                this.currentUser = getUserDisplayName();
            }
        },

        /**
         * Handle user logout
         */
        handleLogout() {
            // Clear authentication data
            clearAuthData();
            
            // Update state
            this.isLoggedIn = false;
            this.currentUser = '';

            // Show logout message
            if (this.$flashMessage) {
                this.$flashMessage.show({
                    status: 'info',
                    title: 'Logged Out',
                    message: 'You have been logged out successfully.'
                });
            }

            // Redirect to login page
            this.$router.push('/login?logout=true');
        },

        /**
         * Initialize dropdown menu (Semantic UI)
         */
        initDropdown() {
            this.$nextTick(() => {
                // Initialize Semantic UI dropdown if jQuery is available
                if (window.$ && window.$.fn.dropdown) {
                    window.$('.ui.dropdown').dropdown({
                        on: 'click',           // Only open on click
                        action: 'hide',        // Hide after selection
                        transition: 'drop'     // Smooth transition
                    });
                }
                });
        }
    },
    mounted() {
        // Check authentication on mount
        this.checkAuth();
        
        // Initialize dropdown
        this.initDropdown();
    },
    watch: {
        /**
         * Watch route changes to update auth status
         */
        $route() {
            this.checkAuth();
            this.initDropdown();
        }
    }
};
</script>
<style>
#app .navbar {
    margin-bottom: 1.5em;                      /* Add space below the navbar */
}

.myFlash {
    position: absolute;                        /* Position the flash message box */
    top: 0;
    right: 0;
    width: 300px;                              /* Set fixed width for flash message */
}

div.label {
    width: 120px;                              /* Set fixed width for label blocks */
}

div.input {
    margin-bottom: 10px;                       /* Add spacing between inputs */
}

button.ui.button {
    margin-top: 15px;                          /* Space above the submit button */
    display: block;                            /* Make button take full width of container */
}
</style>