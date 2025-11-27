<template>
  <div class="register-container">
    <div class="ui middle aligned center aligned grid">
      <div class="column">
        <h2 class="ui teal header">
          <div class="content">
            Create New Account
          </div>
        </h2>
        
        <form class="ui large form" @submit.prevent="handleRegister">
          <div class="ui stacked segment">
            <!-- Error Message -->
            <div v-show="errorMessage && errorMessage.length > 0" style="background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 12px; margin-bottom: 16px; border-radius: 4px;">
              <strong>Registration Failed</strong><br>
              {{ errorMessage }}
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="ui success message">
              <div class="header">Registration Successful</div>
              <p>{{ successMessage }}</p>
            </div>

            <!-- Username Field -->
            <div class="field">
              <div class="ui left icon input">
                <i class="user icon"></i>
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Username"
                  v-model="formData.username"
                  @input="clearError"
                  :disabled="loading"
                >
              </div>
            </div>

            <!-- Email Field -->
            <div class="field">
              <div class="ui left icon input">
                <i class="envelope icon"></i>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email Address"
                  v-model="formData.email"
                  @input="clearError"
                  :disabled="loading"
                >
              </div>
            </div>

            <!-- Full Name Field -->
            <div class="field">
              <div class="ui left icon input">
                <i class="address card icon"></i>
                <input 
                  type="text" 
                  name="fullName" 
                  placeholder="Full Name (Optional)"
                  v-model="formData.fullName"
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
                  placeholder="Password (Min 6 characters)"
                  v-model="formData.password"
                  @input="clearError"
                  :disabled="loading"
                >
              </div>
            </div>

            <!-- Confirm Password Field -->
            <div class="field">
              <div class="ui left icon input">
                <i class="lock icon"></i>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  placeholder="Confirm Password"
                  v-model="formData.confirmPassword"
                  @input="clearError"
                  :disabled="loading"
                >
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="field">
              <div class="ui checkbox">
                <input 
                  type="checkbox" 
                  v-model="formData.agreeTerms"
                  @change="clearError"
                  :disabled="loading"
                  id="agreeTerms"
                >
                <label for="agreeTerms">I agree to the Terms and Conditions</label>
              </div>
            </div>

            <!-- Submit Button -->
            <button 
              class="ui fluid large teal submit button" 
              type="submit"
              :class="{ loading: loading }"
              :disabled="loading"
            >
              Register
            </button>
          </div>
        </form>

        <!-- Login Link -->
        <div class="ui message">
          Already have an account? <router-link to="/login">Log In</router-link>
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
import { register } from '../helpers/api-auth';
import { saveAuthData } from '../helpers/auth';

export default {
  name: 'Register',
  data() {
    return {
      formData: {
        username: '',
        email: '',
        fullName: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      },
      errorMessage: '',
      successMessage: '',
      loading: false
    };
  },
  methods: {
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    /**
     * Validate form data
     * @returns {boolean} True if form is valid
     */
    validateForm() {
      let errorMessages = [];

      // Validate username
      if (!this.formData.username || this.formData.username.trim() === '') {
        errorMessages.push('Username is required');
      } else if (this.formData.username.length < 3) {
        errorMessages.push('Username must be at least 3 characters');
      } else if (this.formData.username.length > 50) {
        errorMessages.push('Username cannot exceed 50 characters');
      }

      // Validate email
      if (!this.formData.email || this.formData.email.trim() === '') {
        errorMessages.push('Email is required');
      } else if (!this.isValidEmail(this.formData.email)) {
        errorMessages.push('Please enter a valid email address');
      }

      // Validate full name (optional but check length if provided)
      if (this.formData.fullName && this.formData.fullName.length > 100) {
        errorMessages.push('Full name cannot exceed 100 characters');
      }

      // Validate password
      if (!this.formData.password || this.formData.password.trim() === '') {
        errorMessages.push('Password is required');
      } else if (this.formData.password.length < 6) {
        errorMessages.push('Password must be at least 6 characters');
      }

      // Validate confirm password
      if (!this.formData.confirmPassword || this.formData.confirmPassword.trim() === '') {
        errorMessages.push('Please confirm your password');
      } else if (this.formData.password !== this.formData.confirmPassword) {
        errorMessages.push('Passwords do not match');
      }

      // Validate terms agreement
      if (!this.formData.agreeTerms) {
        errorMessages.push('You must agree to the terms and conditions');
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
    this.successMessage = ''; 
    },
    /**
     * Handle registration form submission
     */
    async handleRegister() {
      // Clear previous messages
      this.errorMessage = '';
      this.successMessage = '';

      // Validate form
      if (!this.validateForm()) {
      return;
      }

      this.loading = true;

      try {
        // Prepare user data
        const userData = {
        username: this.formData.username.trim(),
        email: this.formData.email.trim(),
        password: this.formData.password
    };

        // Add full name if provided
    if (this.formData.fullName && this.formData.fullName.trim()) {
      userData.fullName = this.formData.fullName.trim();
    }

        // Call register API
        const response = await register(userData);
        if (response.success) {
      // Save authentication data
      saveAuthData(response.token, response.user);

          // Show success message
          this.successMessage = 'Registration successful! Redirecting...';

      if (this.$flashMessage) {
        this.$flashMessage.show({
          status: 'success',
          title: 'Registration Successful',
          message: `Welcome, ${response.user.username}! Your account has been created.`
        });
      }

          // Redirect to words page after 2 seconds
          setTimeout(() => {
          this.$router.push('/words');
          }, 2000);
        }
      } catch (error) {
        console.error('Registration error:', error);
        this.errorMessage = error.message || 'Registration failed. Please try again.';

        // Show error flash message
    if (this.$flashMessage) {
      this.$flashMessage.show({
            status: 'error',
            title: 'Registration Failed',
        message: this.errorMessage
      });
    }
  } finally {
    this.loading = false;
  }
}
  }
};
</script>
