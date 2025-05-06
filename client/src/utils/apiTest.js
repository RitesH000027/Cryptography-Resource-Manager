/**
 * API Test Utility
 * 
 * This file contains functions to test the backend API endpoints
 * for authentication and user management.
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://0.0.0.0:5001/api';

// Test registration endpoint
export const testRegistration = async (userData) => {
  try {
    console.log('Attempting registration with data:', userData);
    
    // First, test if the server is reachable
    try {
      const pingResponse = await fetch(`${API_URL}/health`, { method: 'GET' });
      if (!pingResponse.ok) {
        console.error('Backend server may not be running or reachable');
      }
    } catch (pingError) {
      console.error('Cannot reach backend server:', pingError);
      return { success: false, error: 'Backend server unreachable. Please check if the server is running.' };
    }
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    console.log('Registration API Response:', {
      status: response.status,
      statusText: response.statusText,
      data,
      headers: Object.fromEntries([...response.headers]),
    });
    
    if (!response.ok) {
      console.error('Registration failed:', data.message || 'Unknown error');
      // Log more details about the error
      if (data.errors) {
        console.error('Validation errors:', data.errors);
      }
    } else {
      console.log('Registration successful! Verification email should be sent.');
    }
    
    return { 
      success: response.ok, 
      data,
      status: response.status,
      message: response.ok ? 'Registration successful' : (data.message || 'Registration failed')
    };
  } catch (error) {
    console.error('Registration API Error:', error);
    return { success: false, error: error.message };
  }
};

// Test email verification with OTP
export const testVerifyEmail = async (email, otp) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });
    
    const data = await response.json();
    
    console.log('Email Verification API Response:', {
      status: response.status,
      data,
    });
    
    return { 
      success: response.ok, 
      data,
      message: response.ok ? 'Email verified successfully' : (data.message || 'Verification failed')
    };
  } catch (error) {
    console.error('Email Verification API Error:', error);
    return { success: false, error: error.message };
  }
};

// Test resend verification OTP
export const testResendVerificationOTP = async (email) => {
  try {
    const response = await fetch(`${API_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    console.log('Resend Verification OTP Response:', {
      status: response.status,
      data,
    });
    
    return { 
      success: response.ok, 
      data,
      message: response.ok ? 'Verification OTP resent successfully' : (data.message || 'Failed to resend OTP')
    };
  } catch (error) {
    console.error('Resend Verification API Error:', error);
    return { success: false, error: error.message };
  }
};

// Test login endpoint
export const testLogin = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    console.log('Login API Response:', {
      status: response.status,
      data,
    });
    
    if (!response.ok) {
      console.error('Login failed:', data.message || 'Unknown error');
      if (data.message && data.message.includes('verify')) {
        console.warn('Email verification required. Please check your email for OTP.');
      }
    }
    
    return { 
      success: response.ok, 
      data,
      message: response.ok ? 'Login successful' : (data.message || 'Login failed')
    };
  } catch (error) {
    console.error('Login API Error:', error);
    return { success: false, error: error.message };
  }
};

// Test protected endpoint (requires authentication)
export const testProtectedEndpoint = async (token) => {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    console.log('Protected API Response:', {
      status: response.status,
      data,
    });
    
    return { success: response.ok, data };
  } catch (error) {
    console.error('Protected API Error:', error);
    return { success: false, error: error.message };
  }
};