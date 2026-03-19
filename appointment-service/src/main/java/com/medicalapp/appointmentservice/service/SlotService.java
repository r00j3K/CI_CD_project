package com.medicalapp.appointmentservice.service;

import com.medicalapp.appointmentservice.dto.SlotRequest;
import com.medicalapp.appointmentservice.dto.SlotResponse;
import com.medicalapp.appointmentservice.model.AppointmentSlot;
import com.medicalapp.appointmentservice.model.Doctor;
import com.medicalapp.appointmentservice.repository.AppointmentSlotRepository;
import com.medicalapp.appointmentservice.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SlotService {

    private final AppointmentSlotRepository slotRepository;
    private final DoctorRepository doctorRepository;

    public SlotResponse addSlot(SlotRequest request) {
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException(
                        "Doctor not found with id: " + request.getDoctorId()));

        if (slotRepository.existsByDoctorIdAndStartTime(
                request.getDoctorId(), request.getStartTime())) {
            throw new RuntimeException("Slot already exists for this doctor at this time");
        }

        AppointmentSlot slot = AppointmentSlot.builder()
                .doctor(doctor)
                .startTime(request.getStartTime())
                .endTime(request.getStartTime().plusMinutes(30))
                .available(true)
                .build();

        AppointmentSlot saved = slotRepository.save(slot);
        return mapToResponse(saved);
    }

    public List<SlotResponse> getAvailableSlots() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirtyDaysLater = now.plusDays(30);

        return slotRepository
                .findByAvailableTrueAndStartTimeAfterAndStartTimeBefore(
                        now, thirtyDaysLater)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SlotResponse> getSlotsByDoctor(Long doctorId) {
        doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException(
                        "Doctor not found with id: " + doctorId));

        return slotRepository.findByDoctorIdAndAvailableTrue(doctorId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void markSlotAsUnavailable(Long slotId) {
        AppointmentSlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException(
                        "Slot not found with id: " + slotId));
        slot.setAvailable(false);
        slotRepository.save(slot);
    }

    public void markSlotAsAvailable(Long slotId) {
        AppointmentSlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException(
                        "Slot not found with id: " + slotId));
        slot.setAvailable(true);
        slotRepository.save(slot);
    }

    private SlotResponse mapToResponse(AppointmentSlot slot) {
        return SlotResponse.builder()
                .id(slot.getId())
                .doctorId(slot.getDoctor().getId())
                .doctorFirstName(slot.getDoctor().getFirstName())
                .doctorLastName(slot.getDoctor().getLastName())
                .doctorSpecialization(slot.getDoctor().getSpecialization())
                .roomNumber(slot.getDoctor().getRoomNumber())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .available(slot.isAvailable())
                .build();
    }
}