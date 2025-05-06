/**
 * Server Check Utility
 * 
 * This file contains functions to check the backend server status
 * and diagnose common issues.
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://0.0.0.0:5001/api';

// Check if the server is running
export const checkServerStatus = async () => {
  try {
    // Try to ping the server
    const response = await fetch(`${API_URL}/health`, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (response.ok) {
      console.log('✅ Server is running and reachable');
      return { success: true, message: 'Server is running' };
    } else {
      console.error('❌ Server returned an error status:', response.status);
      return { 
        success: false, 
        message: `Server returned status ${response.status}` 
      };
    }
  } catch (error) {
    console.error('❌ Cannot reach server:', error);
    return { 
      success: false, 
      message: 'Cannot reach server. Please check if it is running.',
      error: error.message
    };
  }
};

// Check CORS configuration
export const checkCorsConfig = async () => {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    if (response.ok) {
      console.log('✅ CORS is properly configured');
      return { success: true, message: 'CORS is properly configured' };
    } else {
      console.error('❌ CORS might not be properly configured');
      return { 
        success: false, 
        message: 'CORS might not be properly configured' 
      };
    }
  } catch (error) {
    console.error('❌ CORS check failed:', error);
    return { 
      success: false, 
      message: 'CORS check failed',
      error: error.message
    };
  }
};

// Run all checks
export const runAllChecks = async () => {
  const results = {
    serverStatus: await checkServerStatus(),
    corsConfig: await checkCorsConfig()
  };
  
  console.log('Server diagnostic results:', results);
  return results;
};