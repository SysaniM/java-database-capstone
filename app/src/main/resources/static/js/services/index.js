import { openModal } from '../components/modals.js';
import { API_BASE_URL } from '../config/config.js';

const ADMIN_API = API_BASE_URL + '/admin';
const DOCTOR_API = API_BASE_URL + '/doctor/login';

window.onload = function () {
        const adminBtn = document.getElementById('adminLogin');
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            openModal('adminLogin');
        });
    }  
}

window.adminLoginHandler = async function() {
    try {
      // Step 1: Get the entered username and password from the input fields
      const username = document.getElementById('username')?.value || document.getElementById('admin-username')?.value;
      const password = document.getElementById('password')?.value || document.getElementById('admin-password')?.value;
      
      // Validate that fields are not empty
      if (!username || !password) {
        alert('Please enter both username and password');
        return;
      }
      
      // Step 2: Create an admin object with these credentials
      const admin = {
        username: username,
        password: password
      };
      
      // Step 3: Use fetch() to send a POST request to the ADMIN_API endpoint
      const response = await fetch(ADMIN_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(admin)
      });
      
      // Step 4: If the response is successful
      if (response.ok) {
        // Parse the JSON response to get the token
        const data = await response.json();
        const token = data.token || data.accessToken;
        
        // Store the token in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', 'admin');
        
        // Optionally store admin info
        if (data.admin) {
          localStorage.setItem('adminInfo', JSON.stringify(data.admin));
        }
        
        // Call selectRole('admin') to proceed with admin-specific behavior
        if (typeof selectRole === 'function') {
          selectRole('admin');
        } else {
          // Fallback if selectRole function doesn't exist
          console.log('Admin login successful, redirecting to admin dashboard');
          window.location.href = '/admin-dashboard.html';
        }
      } else {
        // Step 5: If login fails or credentials are invalid
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Invalid username or password';
        alert(`Login failed: ${errorMessage}`);
      }
    } catch (error) {
      // Step 6: Wrap everything in a try-catch to handle network or server errors
      console.error('Admin login error:', error);
      alert('An error occurred while trying to log in. Please check your network connection and try again.');
    }
};

window.doctorLoginHandler = async function() {
    try {
      // Step 1: Get the entered email and password from the input fields
      const email = document.getElementById('doctor-email')?.value || 
                    document.getElementById('email')?.value || 
                    document.querySelector('input[type="email"]')?.value;
      
      const password = document.getElementById('doctor-password')?.value || 
                       document.getElementById('password')?.value || 
                       document.querySelector('#password-field, input[type="password"]')?.value;
      
      // Validate that fields are not empty
      if (!email || !email.trim()) {
        alert('Please enter your email address');
        return;
      }
      
      if (!password) {
        alert('Please enter your password');
        return;
      }
      
      // Step 2: Create a doctor object with these credentials
      const doctor = {
        email: email.trim(),
        password: password
      };
      
      // Step 3: Use fetch() to send a POST request to the DOCTOR_API endpoint
      const response = await fetch(DOCTOR_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(doctor)
      });
      
      // Step 4: If login is successful
      if (response.ok) {
        // Parse the JSON response to get the token
        const data = await response.json();
        const token = data.token || data.accessToken;
        
        if (!token) {
          throw new Error('No token received from server');
        }
        
        // Store the token in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', 'doctor');
        
        // Optionally store doctor information
        if (data.doctor) {
          localStorage.setItem('doctorInfo', JSON.stringify(data.doctor));
        }
        
        // Store doctor ID if available
        if (data.doctorId || data.doctor?.id) {
          localStorage.setItem('doctorId', data.doctorId || data.doctor.id);
        }
        
        // Call selectRole('doctor') to proceed with doctor-specific behavior
        if (typeof window.selectRole === 'function') {
          window.selectRole('doctor');
        } else {
          // Fallback: dispatch custom event
          window.dispatchEvent(new CustomEvent('doctorLoginSuccess', { detail: data }));
          console.log('Doctor login successful, redirecting to doctor dashboard');
          // Optional redirect
          // window.location.href = '/doctor-dashboard.html';
        }
      } else {
        // Step 5: If login fails
        let errorMessage = 'Invalid email or password';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use default message
          console.error('Error parsing error response:', e);
        }
        alert(`Login failed: ${errorMessage}`);
      }
    } catch (error) {
      // Step 6: Wrap in a try-catch block to handle errors gracefully
      console.error('Doctor login error:', error);
      alert('An error occurred while trying to log in. Please check your network connection and try again.');
    }
  };
/*
  Import the openModal function to handle showing login popups/modals
  Import the base API URL from the config file
  Define constants for the admin and doctor login API endpoints using the base URL

  Use the window.onload event to ensure DOM elements are available after page load
  Inside this function:
    - Select the "adminLogin" and "doctorLogin" buttons using getElementById
    - If the admin login button exists:
        - Add a click event listener that calls openModal('adminLogin') to show the admin login modal
    - If the doctor login button exists:
        - Add a click event listener that calls openModal('doctorLogin') to show the doctor login modal


  Define a function named adminLoginHandler on the global window object
  This function will be triggered when the admin submits their login credentials

  Step 1: Get the entered username and password from the input fields
  Step 2: Create an admin object with these credentials

  Step 3: Use fetch() to send a POST request to the ADMIN_API endpoint
    - Set method to POST
    - Add headers with 'Content-Type: application/json'
    - Convert the admin object to JSON and send in the body

  Step 4: If the response is successful:
    - Parse the JSON response to get the token
    - Store the token in localStorage
    - Call selectRole('admin') to proceed with admin-specific behavior

  Step 5: If login fails or credentials are invalid:
    - Show an alert with an error message

  Step 6: Wrap everything in a try-catch to handle network or server errors
    - Show a generic error message if something goes wrong


  Define a function named doctorLoginHandler on the global window object
  This function will be triggered when a doctor submits their login credentials

  Step 1: Get the entered email and password from the input fields
  Step 2: Create a doctor object with these credentials

  Step 3: Use fetch() to send a POST request to the DOCTOR_API endpoint
    - Include headers and request body similar to admin login

  Step 4: If login is successful:
    - Parse the JSON response to get the token
    - Store the token in localStorage
    - Call selectRole('doctor') to proceed with doctor-specific behavior

  Step 5: If login fails:
    - Show an alert for invalid credentials

  Step 6: Wrap in a try-catch block to handle errors gracefully
    - Log the error to the console
    - Show a generic error message
*/
