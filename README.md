# System Rezerwacji Wizyt Lekarskich

## Opis projektu
System umożliwiający pacjentom przeglądanie dostępnych terminów wizyt
oraz dokonywanie rezerwacji w wybranej placówce medycznej.
Oparty na architekturze mikrousługowej, napisany w Java + Spring Boot,
uruchamiany w środowisku Docker.


### Stack technologiczny
- **Framework:** Spring Boot
- **Komunikacja między usługami:** REST (HTTP/JSON)
- **Baza danych:** MySQL (każda usługa ma swoją własną bazę)
- **Autoryzacja:** JWT (każda mikrousługa weryfikuje token samodzielnie)
- **API Gateway:** Spring Cloud Gateway (port 8080)
- **Powiadomienia e-mail:** Mock (logowanie na konsolę)

### Domeny biznesowe

#### Lekarze
- Przechowywane dane: imię, nazwisko, specjalizacja, numer gabinetu, numer telefonu
- Jeden lekarz ma dokładnie **jedną specjalizację**
- Lekarzy i sloty mogą dodawać: **ADMIN i DOCTOR**

#### Sloty czasowe
- Czas trwania jednego slotu: **30 minut**
- Pacjent może przeglądać sloty do **30 dni** do przodu

#### Użytkownicy
- Role w systemie: **PATIENT, DOCTOR, ADMIN**
- Nowy użytkownik rejestruje się domyślnie jako **PATIENT**

---

## Architektura systemu
```
Klient (przeglądarka)
        ↓ HTTP/JSON
API Gateway (port 8080)
        ↓
┌───────────────────────────────────────┐
│                                       │
User Service        Appointment Service        Booking Service
(port 8081)         (port 8082)                (port 8083)
│                   │                          │
MySQL:3307          MySQL:3308                 MySQL:3309
(userdb)            (appointmentdb)            (bookingdb)
│
Notification (mock - log na konsolę)
```

---

## Mikrousługi

### 1. User Service (port 8081)
**Odpowiedzialność:** Zarządzanie kontami pacjentów oraz autoryzacja.

**Endpointy:**
| Metoda | URL | Opis | Dostęp |
|--------|-----|------|--------|
| POST | /api/auth/register | Rejestracja nowego użytkownika | Publiczny |
| POST | /api/auth/login | Logowanie, zwraca token JWT | Publiczny |
| GET | /api/auth/health | Health check usługi | Publiczny |

**Modele:**
- `User` — encja użytkownika (id, email, password, firstName, lastName, role)

**Status:** 

---

### 2. Appointment Service (port 8082)
**Odpowiedzialność:** Zarządzanie lekarzami i dostępnymi slotami wizyt.

**Endpointy:**
| Metoda | URL | Opis | Dostęp |
|--------|-----|------|--------|
| POST | /api/doctors | Dodanie nowego lekarza | ADMIN, DOCTOR |
| GET | /api/doctors | Lista wszystkich lekarzy | Zalogowany |
| GET | /api/doctors/{id} | Szczegóły lekarza | Zalogowany |
| POST | /api/slots | Dodanie nowego slotu | ADMIN, DOCTOR |
| GET | /api/slots/available | Lista dostępnych slotów (30 dni) | Zalogowany |
| GET | /api/slots/doctor/{doctorId} | Sloty konkretnego lekarza | Zalogowany |

**Modele:**
- `Doctor` — encja lekarza (id, firstName, lastName, specialization, roomNumber, phoneNumber)
- `AppointmentSlot` — encja slotu (id, doctorId, startTime, endTime, isAvailable)

**Status:** 

---

### 3. Booking Service (port 8083)
**Odpowiedzialność:** Obsługa rezerwacji wizyt i powiadomień.

**Endpointy:**
| Metoda | URL | Opis | Dostęp |
|--------|-----|------|--------|
| POST | /api/bookings | Dokonanie rezerwacji | PATIENT |
| GET | /api/bookings/my | Historia rezerwacji pacjenta | PATIENT |
| DELETE | /api/bookings/{id} | Anulowanie rezerwacji | PATIENT |

**Modele:**
- `Booking` — encja rezerwacji (id, patientEmail, slotId, doctorId, status, createdAt)

**Status:** 
---

### 4. API Gateway (port 8080)
**Odpowiedzialność:** Punkt wejścia dla wszystkich żądań, routing do mikrousług.

**Routing:**
- `/api/auth/**` → User Service (8081)
- `/api/doctors/**` → Appointment Service (8082)
- `/api/slots/**` → Appointment Service (8082)
- `/api/bookings/**` → Booking Service (8083)

**Status:**

---

## Struktura projektu
```
CI_CD_project/
├── README.md
├── pom.xml                          # Parent POM
├── user-service/                    # Mikrousługa użytkowników
│   ├── pom.xml
│   └── src/main/java/com/medicalapp/userservice/
│       ├── controller/              # AuthController
│       ├── dto/                     # RegisterRequest, LoginRequest, AuthResponse
│       ├── model/                   # User
│       ├── repository/              # UserRepository
│       ├── security/                # JwtUtil, SecurityConfig
│       ├── service/                 # UserService, UserDetailsServiceImpl
│       └── UserServiceApplication.java
├── appointment-service/             # Mikrousługa wizyt
│   ├── pom.xml
│   └── src/main/java/com/medicalapp/appointmentservice/
│       ├── controller/              # DoctorController, SlotController
│       ├── dto/                     # DoctorRequest, SlotRequest, SlotResponse
│       ├── model/                   # Doctor, AppointmentSlot
│       ├── repository/              # DoctorRepository, SlotRepository
│       ├── security/                # JwtUtil, SecurityConfig
│       └── service/                 # DoctorService, SlotService
├── booking-service/                 # Mikrousługa rezerwacji
│   └── src/main/java/com/medicalapp/bookingservice/
└── api-gateway/                     # Brama API
```

---

## Uruchomienie projektu

### Wymagania
- Java 17+
- Maven 3.8+
- MySQL (XAMPP lub Docker)
- IntelliJ IDEA 2024

### Uruchomienie lokalne (bez Dockera)
Uruchom każdą usługę osobno w IntelliJ:
1. `UserServiceApplication` — port 8081
2. `AppointmentServiceApplication` — port 8082
3. `BookingServiceApplication` — port 8083
4. `ApiGatewayApplication` — port 8080

### Uruchomienie z Dockerem (planowane)
```bash
docker-compose up --build
```

---

## Testowanie

### User Service
```http
POST http://localhost:8081/api/auth/register
Content-Type: application/json

{
  "email": "jan.kowalski@example.com",
  "password": "haslo123",
  "firstName": "Jan",
  "lastName": "Kowalski"
}
```