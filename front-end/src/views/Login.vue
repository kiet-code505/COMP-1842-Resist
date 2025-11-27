<template>
  <div class="login-container">
    <div class="ui middle aligned center aligned grid">
      <div class="column">
        <h2 class="ui teal header">
          <div class="content">
            Log-in to your account
          </div>
        </h2>
        
        <form class="ui large form" @submit.prevent="handleLogin">
          <div class="ui stacked segment">
            <!-- Error Message -->
            <div v-show="errorMessage && errorMessage.length > 0" style="background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 12px; margin-bottom: 16px; border-radius: 4px;">
              <strong>Login Failed</strong><br>
              {{ errorMessage }}
            </div>

            <!-- Username/Email Field -->
            <div class="field">
              <div class="ui left icon input">
                <i class="user icon"></i>
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Username or Email"
                  v-model="formData.username"
                  @input="clearError"
                  :disabled="loading"
                >
              </div>
            </div>

            <!-- Password Field -->
            <div class="field">
              <div class="ui left icon input">
                <i class="lock icon"></i>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Password"
                  v-model="formData.password"
                  @input="clearError"
                  :disabled="loading"
                >
              </div>
            </div>

            <!-- Remember Me -->
            <div class="field">
              <div class="ui checkbox">
                <input type="checkbox" v-model="rememberMe" :disabled="loading">
                <label>Remember me</label>
              </div>
            </div>

            <!-- Submit Button -->
            <button 
              class="ui fluid large teal submit button" 
              type="submit"
              :class="{ loading: loading }"
              :disabled="loading"
            >
              Login
            </button>
          </div>
        </form>

        <!-- Register Link -->
        <div class="ui message">
          New to us? <router-link to="/register">Sign Up</router-link>
        </div>

        <!-- Back to Words Link -->
        <div class="ui message">
          <router-link to="/words">
            <i class="arrow left icon"></i> Back to Vocabulary
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '../helpers/api-auth';
import { saveAuthData, saveToken, saveUser } from '../helpers/auth';

export default {
  name: 'Login',
  data() {
    return {
      formData: {
        username: '',
        password: ''
      },
      rememberMe: false,
      errorMessage: '',
      loading: false
    };
  },
  methods: {
    /**
     * Validate form data
     * @returns {boolean} True if form is valid
     */
    validateForm() {
      let errorMessages = [];

      // Validate username
      if (!this.formData.username || this.formData.username.trim() === '') {
        errorMessages.push('Username or email is required');
      }

      // Validate password
      if (!this.formData.password || this.formData.password.trim() === '') {
        errorMessages.push('Password is required');
      } else if (this.formData.password.length < 6) {
        errorMessages.push('Password must be at least 6 characters');
      }

      // Set error message if there are validation errors
      if (errorMessages.length > 0) {
        this.errorMessage = errorMessages.join('. ');
        return false;
      }

      return true;
    },

    /**
     * Clear error messages
     */
    clearError() {
      this.errorMessage = '';
    },

    /**
     * Handle login form submission
     */
    async handleLogin() {
      // Clear previous errors
      this.errorMessage = '';

      // Validate form
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;

      try {
        // Call login API
        const response = await login({
          username: this.formData.username.trim(),
          password: this.formData.password
        });

        if (response.success) {
          // Save authentication data
          saveAuthData(response.token, response.user);

          // Show success message
          if (this.$flashMessage) {
            this.$flashMessage.show({
              status: 'success',
              title: 'Login Successful',
              message: `Welcome back, ${response.user.username}!`
            });
          }

          // Redirect to words page or previous page
          const redirectTo = this.$route.query.redirect || '/words';
          setTimeout(() => {
            this.$router.push(redirectTo);
          }, 500);
        }
      } catch (error) {
        console.error('Login error:', error);
        this.errorMessage = error.message || 'Invalid username or password. Please try again.';
        
        // Show error flash message
        if (this.$flashMessage) {
          this.$flashMessage.show({
            status: 'error',
            title: 'Login Failed',
            message: this.errorMessage
          });
        }
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    // Check if already logged in
    if (this.$route.query.logout && this.$flashMessage) {
      this.$flashMessage.show({
        status: 'info',
        title: 'Logged Out',
        message: 'You have been logged out successfully.'
      });
    }
  }
};
</script>
