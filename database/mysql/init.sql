CREATE DATABASE IF NOT EXISTS userdb
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS appointmentdb
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS bookingdb
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;


USE userdb;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role ENUM('PATIENT', 'DOCTOR', 'ADMIN') NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY UK_users_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

USE appointmentdb;

CREATE TABLE IF NOT EXISTS doctors (
    id BIGINT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    room_number VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS appointment_slots (
    id BIGINT NOT NULL AUTO_INCREMENT,
    doctor_id BIGINT NOT NULL,
    sstart_time DATETIME(6) NOT NULL,
    end_time DATETIME(6) NOT NULL,
    available BIT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_slots_doctor
    FOREIGN KEY (doctor_id) REFERENCES doctors (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

USE bookingdb;

CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT NOT NULL AUTO_INCREMENT,
    patient_email VARCHAR(255) NOT NULL,
    slot_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_time DATETIME(6) NOT NULL,
    status ENUM('ACTIVE', 'CANCELLED') NOT NULL,
    created_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE USER IF NOT EXISTS 'medapp_user'@'%' IDENTIFIED BY 'medapp_password';

GRANT ALL PRIVILEGES ON userdb.* TO 'medapp_user'@'%';
GRANT ALL PRIVILEGES ON appointmentdb.* TO 'medapp_user'@'%';
GRANT ALL PRIVILEGES ON bookingdb.* TO 'medapp_user'@'%';

FLUSH PRIVILEGES;

SELECT 'Bazy danych MedApp zainicjalizowane!' AS status;

