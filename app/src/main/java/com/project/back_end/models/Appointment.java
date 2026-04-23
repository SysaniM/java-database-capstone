package com.project.back_end.models;

import java.beans.Transient;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @NotNull(message="Doctor cannot be null")
    private Doctor doctor;

    @ManyToOne
    @NotNull(message="Patient cannot be null")
    private Patient patient;

    @Future
    private LocalDateTime appointmentTime;

    private int status;

    @Transient
    public LocalDateTime getEndTime(){
        return appointmentTime.plusHours(1);
    }

    @Transient
    public LocalDate getAppointmentDate(){
        return appointmentTime.toLocalDate();
    }

    @Transient
    public LocalTime getAppointmentTimeOnly(){
        return appointmentTime.toLocalTime();
    }

    public Long getId(){
        return id;
    }

    public Doctor getDoctor(){
        return doctor;
    }

    public void setDoctor(Doctor doctor){
        this.doctor = doctor;
    }

    public Patient getPatient(){
        return patient;
    }

    public void setPatient(Patient patient){
        this.patient = patient;
    }

    public LocalDateTime getAppointmentTime(){
        return appointmentTime;
    }

    public void setAppointmentTime(LocalDateTime appointmenTime){
        this.appointmenTime = appointmenTime;
    }

    public int getStatus(){
        return status;
    }

    public void setStatus(int status){
        this.status = status;
    }
}