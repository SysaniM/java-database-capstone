import { getAllAppointments } from './services/appointmentRecordService.js';
import { createPatientRow } from './components/patientRows.js';

const patientTableBody = document.getElementById('patientTableBody');
const selectedDate = new Date().toISOString().split('T')[0];
const token = localStorage.getItem('token');
let patientName = null;

const searchBar = document.getElementById('searchBar') || 
                  document.getElementById('searchPatientName') ||
                  document.querySelector('.search-input, #patient-search');

// Function to handle search input
function setupSearchListener() {
  if (!searchBar) {
    console.error('Search bar element not found');
    return;
  }
  
  // Add 'input' event listener to the search bar
  searchBar.addEventListener('input', function(event) {
    // Get the input value
    let inputValue = event.target.value;
    
    // Trim and check the input value
    const trimmedValue = inputValue ? inputValue.trim() : '';
    
    // If not empty, use it as the patientName for filtering
    if (trimmedValue !== '') {
      patientName = trimmedValue;
      console.log('Filtering by patient name:', patientName);
    } else {
      // Else, reset patientName to "null" (as expected by backend)
      patientName = null;
      console.log('Patient name filter cleared');
    }
    
    // Reload the appointments list with the updated filter
    reloadAppointments();
  });
}

// Call the setup function
setupSearchListener();

const todayBtn = document.getElementById('todayBtn') || 
                 document.querySelector('.today-btn') ||
                 document.querySelector('#today-button, [data-action="today"]');

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to reload appointments (to be implemented based on your needs)
async function reloadAppointments() {
  console.log('Reloading appointments for date:', selectedDate);
  // Your existing reload logic here
  // This should fetch appointments using the current selectedDate and patientName filter
}

// Add click listener to the Today button
if (todayBtn) {
  todayBtn.addEventListener('click', function() {
    // Set selectedDate to today's date
    selectedDate = getTodayDate();
    
    // Update the date picker UI to match
    const datePicker = document.getElementById('datePicker') || 
                       document.querySelector('.date-picker, input[type="date"]');
    if (datePicker) {
      datePicker.value = selectedDate;
    }
    
    console.log('Today button clicked. Selected date set to:', selectedDate);
    
    // Reload the appointments for today
    reloadAppointments();
  });
} else {
  console.error('Today button not found');
}

const datePicker = document.getElementById('datePicker') || 
                   document.querySelector('.date-picker') ||
                   document.querySelector('input[type="date"]');

// Function to reload appointments (should be defined elsewhere)
async function reloadAppointments() {
  console.log('Reloading appointments for date:', selectedDate);
  // Your existing reload logic here
}

// Add change event listener to the date picker
if (datePicker) {
  datePicker.addEventListener('change', function(event) {
    // Get the new date value from the event
    const newDate = event.target.value;
    
    // Update selectedDate with the new value
    selectedDate = newDate;
    
    console.log('Date changed to:', selectedDate);
    
    // Reload the appointments for that specific date
    reloadAppointments();
  });
  
  console.log('Date picker change listener attached');
} else {
  console.error('Date picker element not found');
}

async function loadAppointments() {
    try {
      // Step 1: Call getAllAppointments with selectedDate, patientName, and token
      const appointments = await getAllAppointments(selectedDate, patientName, token);
      
      // Get reference to table body
      const tableBody = document.getElementById('patientTableBody');
      if (!tableBody) {
        console.error('Table body element not found');
        return;
      }
      
      // Step 2: Clear the table body content before rendering new rows
      tableBody.innerHTML = '';
      
      // Step 3: If no appointments are returned
      if (!appointments || appointments.length === 0) {
        const noDataRow = tableBody.insertRow();
        noDataRow.innerHTML = `
          <td colspan="5" class="no-appointments-message">
            No Appointments found for today.
          </td>
        `;
        return;
      }
      
      // Step 4: If appointments exist
      for (const appointment of appointments) {
        // Construct a 'patient' object with id, name, phone, and email
        const patient = {
          id: appointment.patientId || appointment.patient?.id,
          name: appointment.patientName || appointment.patient?.name || 'N/A',
          phone: appointment.patientPhone || appointment.patient?.phone || 'N/A',
          email: appointment.patientEmail || appointment.patient?.email || 'N/A'
        };
        
        // Call createPatientRow to generate a table row for the appointment
        const row = createPatientRow(appointment, patient);
        
        // Append each row to the table body
        if (row) {
          tableBody.appendChild(row);
        }
      }
      
      console.log(`Loaded ${appointments.length} appointments for date: ${selectedDate}`);
      
    } catch (error) {
      // Step 5: Catch and handle any errors during fetch
      console.error('Error in loadAppointments:', error);
      
      const tableBody = document.getElementById('patientTableBody');
      if (tableBody) {
        tableBody.innerHTML = '';
        const errorRow = tableBody.insertRow();
        errorRow.innerHTML = `
          <td colspan="5" class="error-message">
            Error loading appointments. Try again later.
          </td>
        `;
      }
    }
  }

document.addEventListener("DOMContentLoaded", () => {
    renderContent();
    loadAppointments()
});

/*
  Import getAllAppointments to fetch appointments from the backend
  Import createPatientRow to generate a table row for each patient appointment


  Get the table body where patient rows will be added
  Initialize selectedDate with today's date in 'YYYY-MM-DD' format
  Get the saved token from localStorage (used for authenticated API calls)
  Initialize patientName to null (used for filtering by name)


  Add an 'input' event listener to the search bar
  On each keystroke:
    - Trim and check the input value
    - If not empty, use it as the patientName for filtering
    - Else, reset patientName to "null" (as expected by backend)
    - Reload the appointments list with the updated filter


  Add a click listener to the "Today" button
  When clicked:
    - Set selectedDate to today's date
    - Update the date picker UI to match
    - Reload the appointments for today


  Add a change event listener to the date picker
  When the date changes:
    - Update selectedDate with the new value
    - Reload the appointments for that specific date


  Function: loadAppointments
  Purpose: Fetch and display appointments based on selected date and optional patient name

  Step 1: Call getAllAppointments with selectedDate, patientName, and token
  Step 2: Clear the table body content before rendering new rows

  Step 3: If no appointments are returned:
    - Display a message row: "No Appointments found for today."

  Step 4: If appointments exist:
    - Loop through each appointment and construct a 'patient' object with id, name, phone, and email
    - Call createPatientRow to generate a table row for the appointment
    - Append each row to the table body

  Step 5: Catch and handle any errors during fetch:
    - Show a message row: "Error loading appointments. Try again later."


  When the page is fully loaded (DOMContentLoaded):
    - Call renderContent() (assumes it sets up the UI layout)
    - Call loadAppointments() to display today's appointments by default
*/
