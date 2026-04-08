# System Rezerwacji Wizyt Lekarskich

## Opis projektu
System umożliwiający pacjentom przeglądanie dostępnych terminów wizyt
oraz dokonywanie rezerwacji w wybranej placówce medycznej.
Oparty na architekturze mikrousługowej, napisany w Java + Spring Boot
z frontendem w React (Nginx), uruchamiany w środowisku Docker Compose.

---

## Architektura systemu

Aplikacja działa w oparciu o architekturę mikrousługową w sieci Docker `medapp-network`.

| Serwis | Technologia | Opis |
|--------|-------------|------|
| **Frontend** | React + Vite, Nginx | Aplikacja webowa serwowana przez Nginx. Komunikuje się wyłącznie przez API Gateway. |
| **API Gateway** | Spring Cloud Gateway | Jedyny punkt wejścia dla klientów. Routing, load balancing, health checks, JWT processing. |
| **User Service** | Spring Boot | Rejestracja, logowanie, zarządzanie użytkownikami, autoryzacja JWT. |
| **Appointment Service** | Spring Boot | Zarządzanie lekarzami, specjalizacjami i dostępnymi slotami wizyt. |
| **Booking Service** | Spring Boot | Rezerwacje wizyt, integracja z Appointment Service, wysyłka e-mail przez SMTP. |
| **MySQL Database** | MySQL 8.0 | Wspólna baza danych dla wszystkich serwisów z trwałym wolumenem `mysql_data`. |

---

## Wymagania techniczne

### Backend
- **Java** 21
- **Maven** 3.8+
- **Spring Boot** 3.2.0
- **Spring Cloud** 2023.0.0 (API Gateway)
- **MySQL** 8.0
- **JWT** (jjwt 0.11.5)
- **Lombok**

### Frontend
- **Node.js** 18.16.1
- **React** + **Vite** 4.4.0
- **React Router DOM**
- **Axios**

---

## Porty

| Serwis | Port |
|--------|------|
| Frontend (Nginx) | 80 |
| API Gateway | 8080 |
| User Service | 8081 |
| Appointment Service | 8082 |
| Booking Service | 8083 |
| MySQL | 3306 |

## Domeny biznesowe

### Lekarze
- Przechowywane dane: imię, nazwisko, specjalizacja, numer gabinetu, numer telefonu
- Jeden lekarz ma dokładnie **jedną specjalizację**
- Lekarzy i sloty mogą dodawać: **ADMIN i DOCTOR**

### Sloty czasowe
- Czas trwania jednego slotu: **30 minut**
- Pacjent może przeglądać sloty do **30 dni** do przodu

### Użytkownicy
- Role w systemie: **PATIENT, DOCTOR, ADMIN**
- Nowy użytkownik rejestruje się domyślnie jako **PATIENT**

### Rezerwacje
- Pacjent może mieć maksymalnie **3 aktywne rezerwacje** jednocześnie
- Po anulowaniu rezerwacji slot **wraca jako dostępny**

### Walidacja formularzy (frontend)
- Hasło minimum **10 znaków**
- Hasło musi zawierać: **wielką literę, małą literę, cyfrę, znak specjalny**
- Imię i nazwisko: **tylko litery**
- Email: **poprawny format**
- Potwierdzenie hasła: **musi być identyczne**

---

## Uruchomienie projektu

#### Wymagania wstępne
- Zainstalowany **Docker Desktop**

#### Uruchomienie
```bash
docker compose up --build
```

Compose zbuduje i uruchomi wszystkie serwisy (`frontend`, `api-gateway`, `user-service`,
`appointment-service`, `booking-service`, `mysql-db`) w sieci `medapp-network`.

#### Otwórz aplikację
Wejdź na `http://localhost`

---

## Domyślne konta testowe

Konta tworzone są automatycznie przy pierwszym uruchomieniu (`DataInitializer`),
jeśli baza danych jest pusta.

| Email | Hasło | Rola |
|-------|-------|------|
| admin@medapp.pl | Admin123! | ADMIN |
| pacjent@medapp.pl | Pacjent123! | PATIENT |

---

