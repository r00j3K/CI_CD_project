package com.medicalapp.userservice.config;

import com.medicalapp.userservice.model.User;
import com.medicalapp.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j // Dodaje logger, żebyś widział w konsoli Dockera co się dzieje
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info(">> Rozpoczynanie inicjalizacji bazy danych użytkowników...");

            User admin = User.builder()
                    .email("admin@medapp.pl")
                    .password(passwordEncoder.encode("Admin123!"))
                    .firstName("Adrian")
                    .lastName("Administrator")
                    .role(User.Role.ADMIN)
                    .build();

            User patient = User.builder()
                    .email("pacjent@medapp.pl")
                    .password(passwordEncoder.encode("Pacjent123!"))
                    .firstName("Jan")
                    .lastName("Kowalski")
                    .role(User.Role.PATIENT)
                    .build();

            userRepository.saveAll(List.of(admin, patient));
            log.info(">> Pomyślnie utworzono 3 użytkowników testowych z poprawnym szyfrowaniem.");
        } else {
            log.info(">> Baza danych użytkowników nie jest pusta, pomijam inicjalizację.");
        }
    }
}