package com.medicalapp.bookingservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;

    @Value("${mail.from}")
    private String fromEmail;

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");

    public void sendBookingConfirmation(String patientEmail,
                                        Long bookingId,
                                        LocalDateTime appointmentTime) {
        String subject = "✅ Potwierdzenie rezerwacji #" + bookingId;
        String content = buildBookingConfirmationEmail(
                patientEmail, bookingId, appointmentTime);

        sendEmail(patientEmail, subject, content);

        log.info("Booking confirmation email sent to: {}", patientEmail);
    }

    public void sendCancellationConfirmation(String patientEmail,
                                             Long bookingId,
                                             LocalDateTime appointmentTime) {
        String subject = "❌ Anulowanie rezerwacji #" + bookingId;
        String content = buildCancellationEmail(
                patientEmail, bookingId, appointmentTime);

        sendEmail(patientEmail, subject, content);

        log.info("Cancellation email sent to: {}", patientEmail);
    }

    private void sendEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    private String buildBookingConfirmationEmail(String email,
                                                 Long bookingId,
                                                 LocalDateTime appointmentTime) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="font-family: Arial, sans-serif; max-width: 600px;
                             margin: 0 auto; padding: 20px;">
                    <div style="background-color: #2b6cb0; padding: 20px;
                                border-radius: 8px 8px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0;">🏥 MedApp</h1>
                    </div>
                    <div style="background-color: #f7fafc; padding: 30px;
                                border-radius: 0 0 8px 8px;
                                border: 1px solid #e2e8f0;">
                        <h2 style="color: #276749;">
                            ✅ Rezerwacja potwierdzona!
                        </h2>
                        <p style="color: #4a5568;">Drogi Pacjencie,</p>
                        <p style="color: #4a5568;">
                            Twoja rezerwacja wizyty została pomyślnie dokonana.
                        </p>
                        <div style="background-color: #ebf8ff; padding: 20px;
                                    border-radius: 8px; margin: 20px 0;
                                    border-left: 4px solid #2b6cb0;">
                            <p style="margin: 5px 0; color: #2d3748;">
                                <strong>Numer rezerwacji:</strong> #%d
                            </p>
                            <p style="margin: 5px 0; color: #2d3748;">
                                <strong>Termin wizyty:</strong> %s
                            </p>
                            <p style="margin: 5px 0; color: #2d3748;">
                                <strong>Email:</strong> %s
                            </p>
                        </div>
                        <p style="color: #4a5568;">
                            Jeśli chcesz anulować rezerwację, zaloguj się do
                            systemu MedApp.
                        </p>
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:5173/patient"
                               style="background-color: #2b6cb0; color: white;
                                      padding: 12px 24px; border-radius: 8px;
                                      text-decoration: none; font-weight: bold;">
                                Przejdź do MedApp
                            </a>
                        </div>
                        <hr style="border: none; border-top: 1px solid #e2e8f0;
                                   margin: 30px 0;">
                        <p style="color: #a0aec0; font-size: 12px;
                                  text-align: center;">
                            Ta wiadomość została wysłana automatycznie przez
                            system MedApp. Prosimy nie odpowiadać na ten email.
                        </p>
                    </div>
                </body>
                </html>
                """.formatted(bookingId, appointmentTime.format(FORMATTER), email);
    }

    private String buildCancellationEmail(String email,
                                          Long bookingId,
                                          LocalDateTime appointmentTime) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="font-family: Arial, sans-serif; max-width: 600px;
                             margin: 0 auto; padding: 20px;">
                    <div style="background-color: #2b6cb0; padding: 20px;
                                border-radius: 8px 8px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0;">🏥 MedApp</h1>
                    </div>
                    <div style="background-color: #f7fafc; padding: 30px;
                                border-radius: 0 0 8px 8px;
                                border: 1px solid #e2e8f0;">
                        <h2 style="color: #c53030;">
                            ❌ Rezerwacja anulowana
                        </h2>
                        <p style="color: #4a5568;">Drogi Pacjencie,</p>
                        <p style="color: #4a5568;">
                            Twoja rezerwacja wizyty została anulowana.
                        </p>
                        <div style="background-color: #fff5f5; padding: 20px;
                                    border-radius: 8px; margin: 20px 0;
                                    border-left: 4px solid #e53e3e;">
                            <p style="margin: 5px 0; color: #2d3748;">
                                <strong>Numer rezerwacji:</strong> #%d
                            </p>
                            <p style="margin: 5px 0; color: #2d3748;">
                                <strong>Anulowany termin:</strong> %s
                            </p>
                            <p style="margin: 5px 0; color: #2d3748;">
                                <strong>Email:</strong> %s
                            </p>
                        </div>
                        <p style="color: #4a5568;">
                            Możesz zarezerwować nowy termin wizyty w systemie
                            MedApp.
                        </p>
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:5173/patient"
                               style="background-color: #2b6cb0; color: white;
                                      padding: 12px 24px; border-radius: 8px;
                                      text-decoration: none; font-weight: bold;">
                                Zarezerwuj nowy termin
                            </a>
                        </div>
                        <hr style="border: none; border-top: 1px solid #e2e8f0;
                                   margin: 30px 0;">
                        <p style="color: #a0aec0; font-size: 12px;
                                  text-align: center;">
                            Ta wiadomość została wysłana automatycznie przez
                            system MedApp. Prosimy nie odpowiadać na ten email.
                        </p>
                    </div>
                </body>
                </html>
                """.formatted(bookingId, appointmentTime.format(FORMATTER), email);
    }
}