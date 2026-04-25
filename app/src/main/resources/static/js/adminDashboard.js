import { openModal } from './components/modals.js';
import { getDoctors } from './services/doctorServices.js';
import { filterDoctors } from './services/doctorServices.js';//call the same function to avoid duplication coz the functionality was same
import { saveDoctor } from './services/doctorServices.js';
import { createDoctorCard } from './components/doctorCard.js';

document.getElementById('addDocBtn').addEventListener('click', () => {
    openModal('addDoctor');
   });

document.addEventListener("DOMContentLoaded", () => {
    loadDoctorCards();
});

function loadDoctorCards() {
    getDoctors()
      .then(doctors => {
        const contentDiv = document.getElementById("content");
        contentDiv.innerHTML = "";
  
        doctors.forEach(doctor => {
          const card = createDoctorCard(doctor);
          contentDiv.appendChild(card);
        });
      })
      .catch(error => {
        console.error("Failed to load doctors:", error);
    });
}
// Filter Input
document.getElementById("searchBar").addEventListener("input", filterDoctorsOnChange);
document.getElementById("filterTime").addEventListener("change", filterDoctorsOnChange);
document.getElementById("filterSpecialty").addEventListener("change", filterDoctorsOnChange);

function filterDoctorsOnChange() {
    const searchBar = document.getElementById("searchBar").value.trim();
    const filterTime = document.getElementById("filterTime").value;
    const filterSpecialty = document.getElementById("filterSpecialty").value;
  
  
    const name = searchBar.length > 0 ? searchBar : null;
    const time = filterTime.length > 0 ? filterTime : null;
    const specialty = filterSpecialty.length > 0 ? filterSpecialty : null;
  
    filterDoctors(name, time, specialty)
      .then(response => {
        const doctors = response.doctors;
        const contentDiv = document.getElementById("content");
        contentDiv.innerHTML = "";
  
        if (doctors.length > 0) {
          console.log(doctors);
          doctors.forEach(doctor => {
            const card = createDoctorCard(doctor);
            contentDiv.appendChild(card);
          });
        } else {
          contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
          console.log("Nothing");
        }
      })
      .catch(error => {
        console.error("Failed to filter doctors:", error);
        alert("❌ An error occurred while filtering doctors.");
      });
}

function renderDoctorCards(doctors) {
    // Clear the content area
    const contentArea = document.getElementById('main-container');

    if (!contentArea) {
        console.error('Content area not found');
        return;
    }

    contentArea.innerHTML = '';

    // Loop through the doctors and append each card to the content area
    doctors.forEach(doctor => {
        const doctorCard = createDoctorCard(doctor);
        contentArea.appendChild(doctorCard);
    });
}

async function adminAddDoctor() {
    try {
      // Collect input values from the modal form
      const name = document.getElementById('doctor-name')?.value || 
                   document.querySelector('#addDoctorForm input[name="name"]')?.value;
      
      const email = document.getElementById('doctor-email')?.value || 
                    document.querySelector('#addDoctorForm input[name="email"]')?.value;
      
      const phone = document.getElementById('doctor-phone')?.value || 
                    document.querySelector('#addDoctorForm input[name="phone"]')?.value;
      
      const password = document.getElementById('doctor-password')?.value || 
                       document.querySelector('#addDoctorForm input[name="password"]')?.value;
      
      const specialty = document.getElementById('doctor-specialty')?.value || 
                        document.querySelector('#addDoctorForm select[name="specialty"]')?.value ||
                        document.querySelector('#addDoctorForm input[name="specialty"]')?.value;
      
      // Collect available times (checkbox or multi-select)
      let availableTimes = [];
      const timeCheckboxes = document.querySelectorAll('#addDoctorForm input[name="available-times"]:checked, .time-checkbox:checked');
      if (timeCheckboxes.length > 0) {
        availableTimes = Array.from(timeCheckboxes).map(cb => cb.value);
      } else {
        // Alternative: get from text input
        const timesInput = document.getElementById('doctor-times')?.value;
        if (timesInput) {
          availableTimes = timesInput.split(',').map(time => time.trim());
        }
      }
      
      // Retrieve the authentication token from localStorage
      const token = localStorage.getItem('token');
      
      // If no token is found, show an alert and stop execution
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }
      
      // Build a doctor object with the form values
      const doctor = {
        name: name.trim(),
        email: email.trim(),
        password: password,
        specialty: specialty.trim(),
        phone: phone ? phone.trim() : '',
        availableTimes: availableTimes
      };
      
      // Call saveDoctor(doctor, token) from the service
      const result = await saveDoctor(doctor, token);
      
      // If save is successful
      if (result.success) {
        // Show a success message
        alert(result.message || 'Doctor added successfully!');
        
        // Close the modal
        if (typeof closeModal === 'function') {
          closeModal();
        } else if (typeof openModal === 'function') {
          // Try to close by opening with no parameter or using DOM manipulation
          const modal = document.getElementById('addDoctorModal') || 
                       document.querySelector('.modal');
          if (modal) {
            modal.style.display = 'none';
          }
        }
        
        // Reload the page
        window.location.reload();
      } else {
        // If saving fails, show an error message
        alert(`Failed to add doctor: ${result.message}`);
      }
    } catch (error) {
      console.error('Error in adminAddDoctor:', error);
      alert('An unexpected error occurred while adding the doctor. Please try again.');
    }
}
/*
  This script handles the admin dashboard functionality for managing doctors:
  - Loads all doctor cards
  - Filters doctors by name, time, or specialty
  - Adds a new doctor via modal form


  Attach a click listener to the "Add Doctor" button
  When clicked, it opens a modal form using openModal('addDoctor')


  When the DOM is fully loaded:
    - Call loadDoctorCards() to fetch and display all doctors


  Function: loadDoctorCards
  Purpose: Fetch all doctors and display them as cards

    Call getDoctors() from the service layer
    Clear the current content area
    For each doctor returned:
    - Create a doctor card using createDoctorCard()
    - Append it to the content div

    Handle any fetch errors by logging them


  Attach 'input' and 'change' event listeners to the search bar and filter dropdowns
  On any input change, call filterDoctorsOnChange()


  Function: filterDoctorsOnChange
  Purpose: Filter doctors based on name, available time, and specialty

    Read values from the search bar and filters
    Normalize empty values to null
    Call filterDoctors(name, time, specialty) from the service

    If doctors are found:
    - Render them using createDoctorCard()
    If no doctors match the filter:
    - Show a message: "No doctors found with the given filters."

    Catch and display any errors with an alert


  Function: renderDoctorCards
  Purpose: A helper function to render a list of doctors passed to it

    Clear the content area
    Loop through the doctors and append each card to the content area


  Function: adminAddDoctor
  Purpose: Collect form data and add a new doctor to the system

    Collect input values from the modal form
    - Includes name, email, phone, password, specialty, and available times

    Retrieve the authentication token from localStorage
    - If no token is found, show an alert and stop execution

    Build a doctor object with the form values

    Call saveDoctor(doctor, token) from the service

    If save is successful:
    - Show a success message
    - Close the modal and reload the page

    If saving fails, show an error message
*/
