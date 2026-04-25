import { API_BASE_URL } from '../config/config.js';

const DOCTOR_API = API_BASE_URL + '/doctor'

async function getDoctors() {
    try {      
      // Use fetch() to send a GET request to the DOCTOR_API endpoint
      const response = await fetch(DOCTOR_API, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Convert the response to JSON
      const data = await response.json();
      
      // Return the 'doctors' array from the response
      // Handle different possible response structures
      if (data.doctors && Array.isArray(data.doctors)) {
        return data.doctors;
      } else if (Array.isArray(data)) {
        return data;
      } else if (data.doctorList && Array.isArray(data.doctorList)) {
        return data.doctorList;
      } else {
        // If no doctors array found, return empty array
        console.warn('Unexpected response structure:', data);
        return [];
      }
    } catch (error) {
      // If there's an error (e.g., network issue), log it and return an empty array
      console.error('Error fetching doctors:', error);
      return [];
    }
}

async function deleteDoctor(id, token) {
    try {
      // Build URL with doctor ID and token as path parameters
      const DELETE_DOCTOR_API = `${API_BASE_URL}/doctors/${id}?token=${token}`;
      
      // Use fetch() with the DELETE method
      const response = await fetch(DELETE_DOCTOR_API, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      // Convert the response to JSON
      const data = await response.json();
      
      // Return an object with success status and message
      if (response.ok) {
        return {
          success: true,
          message: data.message || 'Doctor deleted successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || data.error || 'Failed to delete doctor'
        };
      }
    } catch (error) {
      // If an error occurs, log it and return a default failure response
      console.error('Error in deleteDoctor:', error);
      return {
        success: false,
        message: 'Network error: Unable to connect to the server'
      };
    }
  }

  async function saveDoctor(doctor, token) {
    try {
      // Build URL with token in the path
      const SAVE_DOCTOR_API = `${API_BASE_URL}/doctors?token=${token}`;
      
      // Use fetch() with the POST method
      const response = await fetch(SAVE_DOCTOR_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(doctor)
      });
      
      // Parse the JSON response
      const data = await response.json();
      
      // Return success status and message
      if (response.ok) {
        return {
          success: true,
          message: data.message || 'Doctor created successfully',
          doctor: data.doctor || data.data || null
        };
      } else {
        return {
          success: false,
          message: data.message || data.error || 'Failed to create doctor'
        };
      }
    } catch (error) {
      // Catch and log errors
      console.error('Error in saveDoctor:', error);
      return {
        success: false,
        message: 'Network error: Unable to connect to the server'
      };
    }
}

async function filterDoctors(name = '', time = '', specialty = '') {
    try {
      // Build URL with name, time, and specialty as URL path parameters
      const queryParams = new URLSearchParams();
      
      if (name && name.trim()) {
        queryParams.append('name', name.trim());
      }
      if (time && time.trim()) {
        queryParams.append('time', time.trim());
      }
      if (specialty && specialty.trim()) {
        queryParams.append('specialty', specialty.trim());
      }
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/doctors/filter${queryString ? `?${queryString}` : ''}`;
      
      // Use fetch() with the GET method
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      // Check if the response is OK
      if (response.ok) {
        // Parse and return the doctor data
        const data = await response.json();
        
        // Handle different response structures
        const doctors = data.doctors || data.data || (Array.isArray(data) ? data : []);
        
        return {
          success: true,
          doctors: doctors,
          totalCount: doctors.length,
          message: data.message || 'Doctors filtered successfully'
        };
      } else {
        // If not OK, log the error and return an object with an empty 'doctors' array
        const errorData = await response.json().catch(() => ({}));
        console.error('Filter doctors error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        return {
          success: false,
          doctors: [],
          totalCount: 0,
          message: errorData.message || `Failed to filter doctors (Status: ${response.status})`
        };
      }
    } catch (error) {
      // Catch any other errors, alert the user, and return a default empty result
      console.error('Error in filterDoctors:', error);
      alert('Unable to filter doctors. Please check your network connection and try again.');
      
      return {
        success: false,
        doctors: [],
        totalCount: 0,
        message: 'Network error: Unable to connect to the server'
      };
    }
}
/*
  Import the base API URL from the config file
  Define a constant DOCTOR_API to hold the full endpoint for doctor-related actions


  Function: getDoctors
  Purpose: Fetch the list of all doctors from the API

   Use fetch() to send a GET request to the DOCTOR_API endpoint
   Convert the response to JSON
   Return the 'doctors' array from the response
   If there's an error (e.g., network issue), log it and return an empty array


  Function: deleteDoctor
  Purpose: Delete a specific doctor using their ID and an authentication token

   Use fetch() with the DELETE method
    - The URL includes the doctor ID and token as path parameters
   Convert the response to JSON
   Return an object with:
    - success: true if deletion was successful
    - message: message from the server
   If an error occurs, log it and return a default failure response


  Function: saveDoctor
  Purpose: Save (create) a new doctor using a POST request

   Use fetch() with the POST method
    - URL includes the token in the path
    - Set headers to specify JSON content type
    - Convert the doctor object to JSON in the request body

   Parse the JSON response and return:
    - success: whether the request succeeded
    - message: from the server

   Catch and log errors
    - Return a failure response if an error occurs


  Function: filterDoctors
  Purpose: Fetch doctors based on filtering criteria (name, time, and specialty)

   Use fetch() with the GET method
    - Include the name, time, and specialty as URL path parameters
   Check if the response is OK
    - If yes, parse and return the doctor data
    - If no, log the error and return an object with an empty 'doctors' array

   Catch any other errors, alert the user, and return a default empty result
*/
