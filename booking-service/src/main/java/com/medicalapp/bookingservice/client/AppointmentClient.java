package com.medicalapp.bookingservice.client;

import com.medicalapp.bookingservice.dto.SlotResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Component
@RequiredArgsConstructor
public class AppointmentClient {

    @Value("${appointment.service.url}")
    private String appointmentServiceUrl;

    private final RestTemplate restTemplate;

    public SlotResponse getSlot(Long slotId, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<SlotResponse> response = restTemplate.exchange(
                appointmentServiceUrl + "/api/slots/" + slotId,
                HttpMethod.GET,
                entity,
                SlotResponse.class
        );

        return response.getBody();
    }

    public void markSlotUnavailable(Long slotId, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        restTemplate.exchange(
                appointmentServiceUrl + "/api/slots/" + slotId + "/unavailable",
                HttpMethod.PATCH,
                entity,
                Void.class
        );
    }

    public void markSlotAvailable(Long slotId, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        restTemplate.exchange(
                appointmentServiceUrl + "/api/slots/" + slotId + "/available",
                HttpMethod.PATCH,
                entity,
                Void.class
        );
    }
}