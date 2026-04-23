## MySQL Database Design

### Table: patients
- id: INT, Primary Key, Auto Increment
- name: STRING, Not Null
- phone: INT
  
### Table: doctors
- id: INT, Primary Key, Auto Increment
- name: STRING, Not Null
- field: STRING, Not Null
- experience: INT, Not Null
- location: STRING
- phone: INT
  
### Table: appointments
- id: INT, Primary Key, Auto Increment
- doctor_id: INT, Foreign Key → doctors(id)
- patient_id: INT, Foreign Key → patients(id)
- appointment_time: DATETIME, Not Null
- status: INT (0 = Scheduled, 1 = Completed, 2 = Cancelled)
Appointment time should not overlap for a doctor
Appontments are stored for some time
Appointments automatically cancelled if patient or doctor are not available and if appointment is overdue

### Table: admin
- id: INT, Primary Key, Auto Increment
- name: STRING, Not Null

## MongoDB Collection Design

### Collection: prescriptions
```json
{
  "_id": "ObjectId('64abc123456')",
  "patientName": "John Smith",
  "appointmentId": 51,
  "medication": "Paracetamol",
  "dosage": "500mg",
  "doctorNotes": "Take 1 tablet every 6 hours.",
  "refillCount": 2,
  "pharmacy": {
    "name": "Walgreens SF",
    "location": "Market Street"
  }
}
