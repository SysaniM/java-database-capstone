## View doctors
<pre>
+----+------------------------+------------------+------------+--------------+---------------+  
| id | email                  | name             | password   | phone        | specialty     |  
+----+------------------------+------------------+------------+--------------+---------------+  
|  1 | dr.adams@example.com   | Dr. Emily Adams  | pass12345  | 555-101-2020 | Cardiologist  |  
|  2 | dr.johnson@example.com | Dr. Mark Johnson | secure4567 | 555-202-3030 | Neurologist   |  
|  3 | dr.lee@example.com     | Dr. Sarah Lee    | leePass987 | 555-303-4040 | Orthopedist   |  
|  4 | dr.wilson@example.com  | Dr. Tom Wilson   | w!ls0nPwd  | 555-404-5050 | Pediatrician  |  
|  5 | dr.brown@example.com   | Dr. Alice Brown  | brownie123 | 555-505-6060 | Dermatologist |  
+----+------------------------+------------------+------------+--------------+---------------+  
</pre>
5 rows in set (0.01 sec)

## View doctor availability
<pre>
+-----------+-----------------+  
| doctor_id | available_times |  
+-----------+-----------------+  
|         1 | 09:00-10:00     |  
|         1 | 10:00-11:00     |  
|         1 | 11:00-12:00     |  
|         1 | 14:00-15:00     |  
|         2 | 10:00-11:00     |  
+-----------+-----------------+  
</pre>
5 rows in set (0.00 sec)

## View patients
<pre>
+----+-----------------------------+------------------------+----------------+-------------+--------------+  
| id | address                     | email                  | name           | password    | phone        |  
+----+-----------------------------+------------------------+----------------+-------------+--------------+  
|  1 | 101 Oak St, Cityville       | jane.doe@example.com   | Jane Doe       | passJane1   | 888-111-1111 |  
|  2 | 202 Maple Rd, Townsville    | john.smith@example.com | John Smith     | smithSecure | 888-222-2222 |  
|  3 | 303 Pine Ave, Villageton    | emily.rose@example.com | Emily Rose     | emilyPass99 | 888-333-3333 |  
|  4 | 404 Birch Ln, Metropolis    | michael.j@example.com  | Michael Jordan | airmj23     | 888-444-4444 |  
|  5 | 505 Cedar Blvd, Springfield | olivia.m@example.com   | Olivia Moon    | moonshine12 | 888-555-5555 |  
+----+-----------------------------+------------------------+----------------+-------------+--------------+  
</pre>
5 rows in set (0.00 sec)

## View appointments
<pre>
+-----+----------------------------+--------+-----------+------------+  
| id  | appointment_time           | status | doctor_id | patient_id |  
+-----+----------------------------+--------+-----------+------------+  
|  76 | 2025-04-01 09:00:00.000000 |      1 |         1 |          1 |  
|  51 | 2025-04-01 10:00:00.000000 |      1 |         1 |          2 |  
|  84 | 2025-04-01 10:00:00.000000 |      1 |         2 |          1 |  
|  85 | 2025-04-01 11:00:00.000000 |      1 |         2 |          2 |  
| 114 | 2025-04-01 12:00:00.000000 |      1 |         3 |          1 |  
+-----+----------------------------+--------+-----------+------------+  
</pre>
5 rows in set (0.00 sec)

## View admin
<pre>
+----+------------+----------+  
| id | password   | username |  
+----+------------+----------+  
|  1 | admin@1234 | admin    |  
+----+------------+----------+  
</pre>
1 row in set (0.01 sec)

## Check MongoDB prescription entries
[
  {
    _id: ObjectId('6807dd712725f013281e7201'),
    patientName: 'John Smith',
    appointmentId: 51,
    medication: 'Paracetamol',
    dosage: '500mg',
    doctorNotes: 'Take 1 tablet every 6 hours.',
    _class: 'com.project.back_end.models.Prescription'
  },  
  {
    _id: ObjectId('6807dd712725f013281e7202'),
    patientName: 'Emily Rose',
    appointmentId: 52,
    medication: 'Aspirin',
    dosage: '300mg',
    doctorNotes: 'Take 1 tablet after meals.',
    _class: 'com.project.back_end.models.Prescription'
  },  
  {
    _id: ObjectId('6807dd712725f013281e7203'),
    patientName: 'Michael Jordan',
    appointmentId: 53,
    medication: 'Ibuprofen',
    dosage: '400mg',
    doctorNotes: 'Take 1 tablet every 8 hours.',
    _class: 'com.project.back_end.models.Prescription'
  },  
  {
    _id: ObjectId('6807dd712725f013281e7204'),
    patientName: 'Olivia Moon',
    appointmentId: 54,
    medication: 'Antihistamine',
    dosage: '10mg',
    doctorNotes: 'Take 1 tablet daily before bed.',
    _class: 'com.project.back_end.models.Prescription'
  },  
  {
    _id: ObjectId('6807dd712725f013281e7205'),
    patientName: 'Liam King',
    appointmentId: 55,
    medication: 'Vitamin C',
    dosage: '1000mg',
    doctorNotes: 'Take 1 tablet daily.',
    _class: 'com.project.back_end.models.Prescription'
  }
]
