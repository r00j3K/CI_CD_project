# System Rezerwacji Wizyt Lekarskich

## Opis projektu
System umożliwiający pacjentom przeglądanie dostępnych terminów wizyt
oraz dokonywanie rezerwacji w wybranej placówce medycznej.
Oparty na architekturze mikrousługowej, napisany w Java + Spring Boot
z frontendem w React, uruchamiany w środowisku Docker.

---

## Wymagania techniczne

### Backend
- **Java** 21
- **Maven** 3.8+
- **Spring Boot** 3.2.0
- **Spring Cloud** 2023.0.0 (API Gateway)
- **MySQL** 8.0 (XAMPP v3.3.0)
- **JWT** (jjwt 0.11.5)
- **Lombok**

### Frontend
- **Node.js** 18.16.1
- **React** + **Vite** 4.4.0
- **React Router DOM**
- **Axios**

### Narzędzia
- **IntelliJ IDEA** 2024.1
- **XAMPP** 3.3.0 (MySQL + phpMyAdmin)
- **Git** + **GitHub** (repozytorium prywatne)
- **IntelliJ HTTP Client** (testowanie API)

### Porty
| Serwis | Port |
|--------|------|
| API Gateway | 8080 |
| User Service | 8081 |
| Appointment Service | 8082 |
| Booking Service | 8083 |
| MySQL | 3306 |
| Frontend (React) | 5173 |

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

#### Rezerwacje
- Pacjent może mieć maksymalnie **3 aktywne rezerwacje** jednocześnie
- Po anulowaniu rezerwacji slot **wraca jako dostępny**

#### Walidacja formularzy (frontend)
- Hasło minimum **10 znaków**
- Hasło musi zawierać: **wielką literę, małą literę, cyfrę, znak specjalny**
- Imię i nazwisko: **tylko litery**
- Email: **poprawny format**
- Potwierdzenie hasła: **musi być identyczne**

## Uruchomienie projektu

### Wymagania wstępne
1. Zainstalowana **Java 17**
2. Zainstalowany **Maven**
3. Zainstalowany **Node.js 18+**
4. Uruchomiony **MySQL** (np. przez XAMPP)

### Krok 1 — Uruchom bazę danych
Otwórz XAMPP i uruchom **MySQL**

### Krok 2 — Uruchom mikrousługi (w IntelliJ)
Uruchom kolejno w IntelliJ:
1. `UserServiceApplication` — port 8081
2. `AppointmentServiceApplication` — port 8082
3. `BookingServiceApplication` — port 8083
4. `ApiGatewayApplication` — port 8080

### Krok 3 — Uruchom frontend
```bash
cd frontend
npm install
npm run dev
```

### Krok 4 — Otwórz aplikację
Wejdź na `http://localhost:5173`

### Domyślne konta testowe
| Email | Hasło | Rola |
|-------|-------|------|
| jan.kowalski@example.com | haslo123 | PATIENT |
| admin@medical.com | admin123 | ADMIN |

---
