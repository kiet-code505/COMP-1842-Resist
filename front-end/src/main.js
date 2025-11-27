import Vue from 'vue';// Import Vue framework
import App from './App.vue';// Import the main App component
import router from './router';// Import Vue Router configuration from router/index.js

import 'semantic-ui-css/semantic.css';// Import Semantic UI CSS styles globally

Vue.config.productionTip = false;// Disable the production tip in the browser console

new Vue({             // Create a new Vue instance
  router,             // Inject the router into the Vue instance
  render: h => h(App) // Render the App component as the root component
}).$mount('#app');    // Mount the Vue app to the DOM element with id="app"