package com.project.back_end.services;

import com.project.back_end.models.Appointment;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AppointmentService {
    private AppointmentRepository appointmentRepository;
    private PatientRepository patientRepository;
    private Service sharedService;
    private TokenService tokenService;
    private DoctorRepository doctorRepository;

    // 2. Constructor Injection for Dependencies
    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository,
                              Service sharedService,
                              TokenService tokenService,
                              PatientRepository patientRepository,
                              DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.sharedService = sharedService;
        this.tokenService = tokenService;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @Transactional
    public int bookAppointment(Appointment appointment) {
        try {
            // Save the appointment
                switch(sharedService.validateAppointment(appointment)){
                    case(1):
                    appointmentRepository.save(appointment);
                    return 1;
                case(0):
                    return 0;
                case(-1):
                    return 0;
            }
            return 1;
        } catch (Exception e) {
            // Log the exception (in production, use proper logging)
            System.err.println("Error booking appointment: " + e.getMessage());
            return 0;
        }
    }

    @Transactional
    public ResponseEntity<Map<String, String>> updateAppointment(Appointment appointment) {
        Map<String, String> response = new HashMap<>();
        try {
            // Find existing appointment
            Appointment existingAppointment = appointmentRepository.findById(appointment.getId())
                    .orElse(null);

            if (existingAppointment == null) {
                response.put("message", "Appointment not found");
                response.put("status", "FAILURE");
                return ResponseEntity.body(response);
            }

            // Save the updated appointment
            switch(sharedService.validateAppointment(appointment)){
                case(1):
                    appointmentRepository.delete(existingAppointment);
                    appointmentRepository.save(appointment);
                    response.put("message", "Appointment updated successfully");
                    response.put("status", "SUCCESS");
                    return ResponseEntity.body(response);
                case(0):
                    response.put("message", "No matching time slot is found");
                    response.put("status", "FAILURE");
                    return ResponseEntity.body(response);
                case(-1):
                    response.put("message", "The doctor doesnt exist");
                    response.put("status", "FAILURE");
                    return ResponseEntity.body(response);
                default:
                    response.put("message", "Error updating appointment");
                    response.put("status", "FAILURE");
                    return ResponseEntity.body(response);
            }
        } catch (Exception e) {
            response.put("message", "Error updating appointment: " + e.getMessage());
            response.put("status", "FAILURE");
            return ResponseEntity.body(response);
        }
    }

    // 6. Cancel Appointment Method
    @Transactional
    public ResponseEntity<Map<String, String>> cancelAppointment(Long id, Long token) {
        Map<String, String> response = new HashMap<>();
        try {
            // Find the appointment
            Appointment appointment = appointmentRepository.findById(id)
                    .orElse(null);

            if (appointment == null) {
                response.put("message", "Appointment not found");
                response.put("status", "FAILURE");
                return ResponseEntity.body(response);
            }
            appointmentRepository.delete(appointment);
            response.put("message", "Appointment canceled");
            response.put("status", "SUCCESS");
            return ResponseEntity.body(response);

        } catch (Exception e) {
            response.put("message", "Error canceling appointment" + e.getMessage());
            response.put("status", "FAILURE");
            return ResponseEntity.body(response);
        }
    }

    // 7. Get Appointments Method
    @Transactional
    public List<Appointment> getAppointments(Long doctorId, String patientName, LocalDate date, String token) {
        try {
        // Convert date to start and end of day
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        if (patientName != null && !patientName.trim().isEmpty()) {
            // Filter by patient name
            return appointmentRepository.findByDoctorIdAndPatient_NameContainingIgnoreCaseAndAppointmentTimeBetween(
                    doctorId, patientName, startOfDay, endOfDay);
        } else {
            // No patient name filter
            return appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(
                    doctorId, startOfDay, endOfDay);
        }
        } catch (Exception e) {
            System.err.println("Error retrieving appointments: " + e.getMessage());
            return List.of();
        }
    }
}
// 1. **Add @Service Annotation**:
//    - To indicate that this class is a service layer class for handling business logic.
//    - The `@Service` annotation should be added before the class declaration to mark it as a Spring service component.
//    - Instruction: Add `@Service` above the class definition.

// 2. **Constructor Injection for Dependencies**:
//    - The `AppointmentService` class requires several dependencies like `AppointmentRepository`, `Service`, `TokenService`, `PatientRepository`, and `DoctorRepository`.
//    - These dependencies should be injected through the constructor.
//    - Instruction: Ensure constructor injection is used for proper dependency management in Spring.

// 3. **Add @Transactional Annotation for Methods that Modify Database**:
//    - The methods that modify or update the database should be annotated with `@Transactional` to ensure atomicity and consistency of the operations.
//    - Instruction: Add the `@Transactional` annotation above methods that interact with the database, especially those modifying data.

// 4. **Book Appointment Method**:
//    - Responsible for saving the new appointment to the database.
//    - If the save operation fails, it returns `0`; otherwise, it returns `1`.
//    - Instruction: Ensure that the method handles any exceptions and returns an appropriate result code.

// 5. **Update Appointment Method**:
//    - This method is used to update an existing appointment based on its ID.
//    - It validates whether the patient ID matches, checks if the appointment is available for updating, and ensures that the doctor is available at the specified time.
//    - If the update is successful, it saves the appointment; otherwise, it returns an appropriate error message.
//    - Instruction: Ensure proper validation and error handling is included for appointment updates.

// 6. **Cancel Appointment Method**:
//    - This method cancels an appointment by deleting it from the database.
//    - It ensures the patient who owns the appointment is trying to cancel it and handles possible errors.
//    - Instruction: Make sure that the method checks for the patient ID match before deleting the appointment.

// 7. **Get Appointments Method**:
//    - This method retrieves a list of appointments for a specific doctor on a particular day, optionally filtered by the patient's name.
//    - It uses `@Transactional` to ensure that database operations are consistent and handled in a single transaction.
//    - Instruction: Ensure the correct use of transaction boundaries, especially when querying the database for appointments.

// 8. **Change Status Method**:
//    - This method updates the status of an appointment by changing its value in the database.
//    - It should be annotated with `@Transactional` to ensure the operation is executed in a single transaction.
//    - Instruction: Add `@Transactional` before this method to ensure atomicity when updating appointment status.

