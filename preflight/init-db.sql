
CREATE SCHEMA IF NOT EXISTS public;
DROP TABLE IF EXISTS authperms_permissions;

CREATE TABLE IF NOT EXISTS authperms.permissions (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

INSERT INTO authperms.permissions (id, name)
VALUES
  (1, 'CAN_ACCESS_DOCTOR_DASHBOARD'),
  (2, 'CAN_ACCESS_GENERAL_DASHBOARD'),
  (3, 'CAN_ACCESS_ADMIN_DASHBOARD'),
  (4, 'CAN_ACCESS_RECEPTION_DASHBOARD'),
  (5, 'CAN_ACCESS_NURSING_DASHBOARD'),
  (6, 'CAN_ACCESS_LABORATORY_DASHBOARD'),
  (7, 'CAN_ACCESS_PATIENTS_DASHBOARD'),
  (8, 'CAN_ACCESS_AI_ASSISTANT_DASHBOARD'),
  (9, 'CAN_ACCESS_ANNOUNCEMENT_DASHBOARD'),
  (10, 'CAN_ACCESS_PHARMACY_DASHBOARD'),
  (11, 'CAN_ACCESS_INVENTORY_DASHBOARD'),
  (12, 'CAN_ACCESS_BILLING_DASHBOARD');

DROP TABLE IF EXISTS authperms.group;

CREATE TABLE IF NOT EXISTS authperms.group (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

INSERT INTO authperms.group (id, name)
VALUES
  (1, 'SYSADMINS'),
  (2, 'DOCTOR'),
  (3, 'RECEPTIONIST'),
  (4, 'ACCOUNTANTS'),
  (5, 'NURSE');



CREATE SCHEMA IF NOT EXISTS public;
DROP TABLE IF EXISTS customuser_customuser;

CREATE TABLE IF NOT EXISTS customuser.customuser (
  id SERIAL PRIMARY KEY,
  password VARCHAR(128) NOT NULL,
  last_login TIMESTAMP(6) NULL,
  is_superuser BOOLEAN NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(255) NULL,
  is_staff BOOLEAN NOT NULL,
  is_active BOOLEAN NOT NULL,
  date_joined TIMESTAMP(6) NOT NULL,
  first_name VARCHAR(150) NOT NULL,
  last_name VARCHAR(150) NOT NULL,
  username VARCHAR(150) NULL,
  date_of_birth DATE NULL,
  profession VARCHAR(50) NULL, 
  role CHAR(20) CHECK (role IN ('patient', 'doctor', 'nurse', 'labtech', 'receptionist', 'sysadmin')),
  groups_id INTEGER REFERENCES authperms.group(id) ON DELETE SET NULL,
  permissions_id INTEGER REFERENCES authperms.permissions(id) ON DELETE SET NULL
);

INSERT INTO customuser.customuser
(id, password, last_login, is_superuser, email, phone, first_name, last_name, is_active, is_staff, date_joined, profession, date_of_birth, role, groups_id)
VALUES
(1, 'pbkdf2_sha256$720000$sLGJYtKxRy2wrcsHSIbZyj$lCVG5TvkzhjtWTPSJVnjgdEtLvDSa9V5LqlrmHQkVh0=', '2024-03-23 18:40:27.725521', '1', 'admin@mail.com', '0798351825', 'Admin', 'Admin', '1', '1', '2024-02-15 15:35:10', 'Software Engineer', '1990-01-01', 'sysadmin', 1);

