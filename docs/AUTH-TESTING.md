# Authentication Testing Guide

This document provides guidelines for testing the authentication system in the SP Banking App.

## Smoke Tests

The `auth-smoke.mjs` script in the scripts directory runs automated smoke tests for the authentication flow. This ensures basic functionality is working correctly.

### Running Smoke Tests

```bash
npm run auth:smoke
```

This runs the build and then executes the auth smoke tests.

## Manual Testing Scenarios

### Sign Up Flow

1. **Valid Registration**

   - Navigate to `/sign-up`
   - Fill in valid information (email, password, name)
   - Submit the form
   - Verify successful registration and redirection

2. **Validation Errors**

   - Try registering with invalid data:
     - Too short password
     - Invalid email format
     - Missing required fields
   - Verify appropriate error messages are displayed

3. **Duplicate Account**
   - Attempt to register with an email that already exists
   - Verify appropriate error message is shown

### Sign In Flow

1. **Valid Login**

   - Navigate to `/sign-in`
   - Enter valid credentials
   - Verify successful login and redirection to dashboard

2. **Invalid Credentials**

   - Enter incorrect email/password
   - Verify appropriate error message
   - Verify security measures (e.g., rate limiting) work as expected

3. **Forgot Password**
   - Click on "Forgot Password"
   - Enter email address
   - Verify reset email flow works correctly

### Password Reset Flow

1. **Request Reset**

   - Test the forgot password flow
   - Verify reset email is sent
   - Check email link format is correct

2. **Complete Reset**
   - Follow reset link
   - Enter new password
   - Verify validation rules apply to new password
   - Verify successful password change

### OAuth Authentication

1. **Google Login**
   - Test Google authentication flow
   - Verify account linking if user exists
   - Verify new account creation if user doesn't exist

### Session Management

1. **Session Persistence**

   - Login and close browser/tab
   - Reopen application
   - Verify session is maintained appropriately

2. **Logout**

   - Test logout functionality
   - Verify session is properly terminated
   - Verify protected routes are no longer accessible

3. **Session Timeout**
   - Test session timeout behavior
   - Verify graceful handling of expired sessions

## Security Testing

1. **XSS Protection**

   - Test input fields with script tags
   - Verify proper escaping of user input

2. **CSRF Protection**

   - Verify CSRF tokens are implemented
   - Test cross-site request scenarios

3. **Rate Limiting**
   - Test multiple failed login attempts
   - Verify account lockout or delay mechanisms

## Testing in Different Environments

Test authentication in:

1. Development environment
2. Staging environment
3. Production environment

Verify that environment-specific configurations work correctly.

## Automated Testing with Appwrite

Since the application uses Appwrite for authentication, also verify:

1. Proper integration with Appwrite authentication APIs
2. Correct handling of Appwrite-specific responses
3. Error handling for Appwrite service disruptions

## Mobile vs Desktop Testing

Test authentication flows on:

1. Desktop browsers
2. Mobile browsers
3. Different screen sizes (responsive design)
