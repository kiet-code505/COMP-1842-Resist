import Vue from 'vue';                 // Import Vue framework
import Router from 'vue-router';      // Import Vue Router for client-side routing
import Words from './views/Words.vue';// Import the Words page component
import Show from './views/Show.vue'; // Import the Show (view word) page component
import Edit from './views/Edit.vue'; // Import the Edit word page component
import New from './views/New.vue';  // Import the New word creation page component
import Login from './views/Login.vue'; // Import the Login page component
import Register from './views/Register.vue'; // Import the Register page component
import { isAuthenticated } from './helpers/auth'; // Import authentication helper

Vue.use(Router);                   // Register Vue Router as a plugin with Vue
const router = new Router({
    mode: 'history',               // Use history mode (clean URLs without hash `#`)
    base: process.env.BASE_URL,    // Set the base URL from environment variable
    linkExactActiveClass: 'active',// Add 'active' class to the exact active route link
    routes: [                      // Define an array of route objects

        {
            path: '/',             // If the URL is just `/`
            redirect: '/words'     // Redirect to `/words`
        },

        {
            path: '/words',        // Path for listing all words
            name: 'words',         // Name of the route
            component: Words,      // Component to load for this route
            meta: { requiresAuth: true } // Requires authentication
        },

        {
            path: '/words/new',    // Path for creating a new word
            name: 'new',           // Route name
            component: New,        // Component to render
            meta: { requiresAuth: true } // Requires authentication
        },

        {
            path: '/words/:id',    // Dynamic path for viewing a single word by ID
            name: 'show',          // Route name
            component: Show,       // Component to render
            meta: { requiresAuth: true } // Requires authentication
        },

        {
            path: '/words/:id/edit',// Dynamic path for editing a word by ID
            name: 'edit',           // Route name
            component: Edit,        // Component to render
            meta: { requiresAuth: true } // Requires authentication
        },

        {
            path: '/login',         // Path for login page
            name: 'login',          // Route name
            component: Login,       // Component to render
            meta: { guest: true }   // Only for guests (not logged in)
        },

        {
            path: '/register',      // Path for register page
            name: 'register',       // Route name
            component: Register,    // Component to render
            meta: { guest: true }   // Only for guests (not logged in)
        },
    ]
});

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
    const isUserAuthenticated = isAuthenticated();
    
    // Check if route requires authentication
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isUserAuthenticated) {
            // User is not authenticated, redirect to login
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            });
        } else {
            // User is authenticated, proceed
            next();
        }
    } 
    // Check if route is for guests only (login, register)
    else if (to.matched.some(record => record.meta.guest)) {
        if (isUserAuthenticated) {
            // User is already logged in, redirect to words
            next({ path: '/words' });
        } else {
            // User is not logged in, proceed
            next();
        }
    } 
    // Route doesn't require authentication
    else {
        next();
    }
});

export default router;