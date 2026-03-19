package com.medicalapp.appointmentservice.controller;

import com.medicalapp.appointmentservice.dto.SlotRequest;
import com.medicalapp.appointmentservice.dto.SlotResponse;
import com.medicalapp.appointmentservice.service.SlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
public class SlotController {

    private final SlotService slotService;

    @PostMapping
    public ResponseEntity<SlotResponse> addSlot(@RequestBody SlotRequest request) {
        return ResponseEntity.ok(slotService.addSlot(request));
    }

    @GetMapping("/available")
    public ResponseEntity<List<SlotResponse>> getAvailableSlots() {
        return ResponseEntity.ok(slotService.getAvailableSlots());
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<SlotResponse>> getSlotsByDoctor(
            @PathVariable Long doctorId) {
        return ResponseEntity.ok(slotService.getSlotsByDoctor(doctorId));
    }

    @PostMapping("/{slotId}/unavailable")
    public ResponseEntity<Void> markAsUnavailable(@PathVariable Long slotId) {
        slotService.markSlotAsUnavailable(slotId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{slotId}/available")
    public ResponseEntity<Void> markAsAvailable(@PathVariable Long slotId) {
        slotService.markSlotAsAvailable(slotId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Appointment Service is running!");
    }

    @GetMapping("/{slotId}")
    public ResponseEntity<SlotResponse> getSlotById(@PathVariable Long slotId) {
        return ResponseEntity.ok(slotService.getSlotById(slotId));
    }
}