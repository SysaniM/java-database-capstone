package com.project.back_end.controllers;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Doctor;
import com.project.back_end.services.DoctorService;
import com.project.back_end.services.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("${api.path}doctor")
public class DoctorController {
    private final DoctorService doctorService;
    private final Service service;

    @Autowired
    public DoctorController(DoctorService doctorService,
                            Service service){
        this.doctorService = doctorService;
        this.service = service;
    }

    @GetMapping("/availability/{user}/{doctorId}/{date}/{token}")
    public Map<String, Object> getDoctorAvailability(@PathVariable String user,
                                                     @PathVariable long doctorId,
                                                     @PathVariable LocalDate date,
                                                     @PathVariable String token){
        Map<String, Object> response = new LinkedHashMap<>();
        if (!Service.validateToken(token, user)){
            response.put("message", "Invalid token");
            return response;
        }

        response.put("availability", doctorService.getDoctorAvailability(doctorId, date));
        return response;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDoctor(){
        Map<String, Object> response= new LinkedHashMap<>();
        response.put("doctors", doctorService.getDoctors());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/{token}")
    public ResponseEntity<Map<String, Object>> saveDoctor(Doctor doctor,
                                                          @PathVariable String token){
        Map<String, Object> response = new LinkedHashMap<>();

        if (!Service.validateToken(token, "admin")) {
            response.put("message", "Invalid token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        switch(doctorService.saveDoctor(doctor)){
            case(1):
                response.put("message", "Doctor added to db");
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            case(-1):
                response.put("message", "Doctor already exists");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            default:
                response.put("message", "Some internal error occurred");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> doctorLogin(@PathVariable Login login){
        return doctorService.validateDoctor(login);
    }

    @PutMapping("/{token}")
    public ResponseEntity<Map<String, String>> updateDoctor(Doctor doctor,
                                                            @PathVariable String token){
        Map<String, String> response = new LinkedHashMap<>();
        if (!Service.validateToken(token, "admin")) {
            response.put("message", "Invalid token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        switch(doctorService.updateDoctor(doctor)){
            case(1):
                response.put("message", "Doctor updated");
                return ResponseEntity.status(HttpStatus.OK).body(response);
            case(-1):
                response.put("message", "Doctor not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            default:
                response.put("message", "Some internal error occurred");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/{id}/{token}")
    public ResponseEntity<Map<String, String>> deleteDoctor(@PathVariable long id,
                                                            @PathVariable String token){
        Map<String, String> response = new LinkedHashMap<>();
        if (!Service.validateToken(token, "admin")) {
            response.put("message", "Invalid token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        switch(doctorService.deleteDoctor(id)){
            case(1):
                response.put("message", "Doctor deleted successfully");
                return ResponseEntity.status(HttpStatus.OK).body(response);
            case(-1):
                response.put("message", "Doctor not found with id");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            default:
                response.put("message", "Some internal error occurred");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/filter/{name}/{time}/{speciality}")
    public Map<String, Object> filterDoctors(@PathVariable String name,
                                             @PathVariable String time,
                                             @PathVariable String speciality){
        return service.filterDoctor(name, speciality, time);
    }
// 1. Set Up the Controller Class:
//    - Annotate the class with `@RestController` to define it as a REST controller that serves JSON responses.
//    - Use `@RequestMapping("${api.path}doctor")` to prefix all endpoints with a configurable API path followed by "doctor".
//    - This class manages doctor-related functionalities such as registration, login, updates, and availability.


// 2. Autowire Dependencies:
//    - Inject `DoctorService` for handling the core logic related to doctors (e.g., CRUD operations, authentication).
//    - Inject the shared `Service` class for general-purpose features like token validation and filtering.


// 3. Define the `getDoctorAvailability` Method:
//    - Handles HTTP GET requests to check a specific doctor’s availability on a given date.
//    - Requires `user` type, `doctorId`, `date`, and `token` as path variables.
//    - First validates the token against the user type.
//    - If the token is invalid, returns an error response; otherwise, returns the availability status for the doctor.


// 4. Define the `getDoctor` Method:
//    - Handles HTTP GET requests to retrieve a list of all doctors.
//    - Returns the list within a response map under the key `"doctors"` with HTTP 200 OK status.


// 5. Define the `saveDoctor` Method:
//    - Handles HTTP POST requests to register a new doctor.
//    - Accepts a validated `Doctor` object in the request body and a token for authorization.
//    - Validates the token for the `"admin"` role before proceeding.
//    - If the doctor already exists, returns a conflict response; otherwise, adds the doctor and returns a success message.


// 6. Define the `doctorLogin` Method:
//    - Handles HTTP POST requests for doctor login.
//    - Accepts a validated `Login` DTO containing credentials.
//    - Delegates authentication to the `DoctorService` and returns login status and token information.


// 7. Define the `updateDoctor` Method:
//    - Handles HTTP PUT requests to update an existing doctor's information.
//    - Accepts a validated `Doctor` object and a token for authorization.
//    - Token must belong to an `"admin"`.
//    - If the doctor exists, updates the record and returns success; otherwise, returns not found or error messages.


// 8. Define the `deleteDoctor` Method:
//    - Handles HTTP DELETE requests to remove a doctor by ID.
//    - Requires both doctor ID and an admin token as path variables.
//    - If the doctor exists, deletes the record and returns a success message; otherwise, responds with a not found or error message.


// 9. Define the `filter` Method:
//    - Handles HTTP GET requests to filter doctors based on name, time, and specialty.
//    - Accepts `name`, `time`, and `speciality` as path variables.
//    - Calls the shared `Service` to perform filtering logic and returns matching doctors in the response.


}