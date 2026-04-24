/*
Define the Function
Create a named export so other files can import and use this function.
Accept one argument: a doctor object containing info like name, specialty, etc.
*/
export function createDoctorCard(doctor){
  /*
  Create the Main Card Container
  Dynamically create a <div> element.
  */
  const card = document.createElement("div");
  //Add a CSS class doctor-card for styling purposes.
  card.classList.add("doctor-card");

  /*
  Fetch the User’s Role
  Read the current user’s role (admin, patient, loggedPatient) from localStorage.
  You'll use this later to decide which buttons to show.
  */
  const role = localStorage.getItem("userRole");

  /*
  Create Doctor Info Section
  //Make a nested container to hold the doctor’s name, specialty, email, and availability.
  */
  const infoDiv = document.createElement("div");
  infoDiv.classList.add("doctor-info");

  /*
  Then add individual elements:
  Create a heading element and set the text to the doctor’s name.
  */
  const name = document.createElement("h3");
  name.textContent = doctor.name;

  //Repeat similarly for: specialization, email, availability
  const specialization = document.createElement("h3");
  specialization.textContent = doctor.specialization;

  const email = document.createElement("h3");
  email.textContent = doctor.email;

  const availability = document.createElement("h3");
  availability.textContent = doctor.availability;

  //Then append them all
  infoDiv.appendChild(name);
  infoDiv.appendChild(specialization);
  infoDiv.appendChild(email);
  infoDiv.appendChild(availability);

  //Create Button Container
  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("card-actions");

  /*
  A new <div> to hold buttons like "Delete" or "Book Now".
  Conditionally Add Buttons Based on Role
  */
  if (role === "admin") {
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Delete";

    removeBtn.addEventListener("click", async () => {
      // 1. Confirm deletion
      // 2. Get token from localStorage
      // 3. Call API to delete
      // 4. On success: remove the card from the DOM
    });
  } else if (role === "patient") {
    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";
    bookNow.addEventListener("click", () => {
      alert("Patient needs to login first.");
    });
  } else if (role === "loggedPatient") {
    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";
    bookNow.addEventListener("click", async (e) => {
      const token = localStorage.getItem("token");
      const patientData = await getPatientData(token);
      showBookingOverlay(e, doctor, patientData);
    });
  }
  card.appendChild(infoDiv);
  card.appendChild(actionsDiv);
  return card;
}

/*
Import the overlay function for booking appointments from loggedPatient.js

  Import the deleteDoctor API function to remove doctors (admin role) from docotrServices.js

  Import function to fetch patient details (used during booking) from patientServices.js

  Function to create and return a DOM element for a single doctor card
    Create the main container for the doctor card
    Retrieve the current user role from localStorage
    Create a div to hold doctor information
    Create and set the doctor’s name
    Create and set the doctor's specialization
    Create and set the doctor's email
    Create and list available appointment times
    Append all info elements to the doctor info container
    Create a container for card action buttons
    === ADMIN ROLE ACTIONS ===
      Create a delete button
      Add click handler for delete button
     Get the admin token from localStorage
        Call API to delete the doctor
        Show result and remove card if successful
      Add delete button to actions container
   
    === PATIENT (NOT LOGGED-IN) ROLE ACTIONS ===
      Create a book now button
      Alert patient to log in before booking
      Add button to actions container
  
    === LOGGED-IN PATIENT ROLE ACTIONS === 
      Create a book now button
      Handle booking logic for logged-in patient   
        Redirect if token not available
        Fetch patient data with token
        Show booking overlay UI with doctor and patient info
      Add button to actions container
   
  Append doctor info and action buttons to the car
  Return the complete doctor card element
*/
