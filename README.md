Hospital Management System

Overview
This project is a Hospital Management System (HMS) built using the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. It demonstrates the implementation of Authentication, Authorization, and Role-Based Access Control (RBAC), enabling secure and efficient management of users with specific roles.

Features

User Roles and Permissions

Admin:
Add new doctors, nurses, and other staff to the management system.
Delete or deactivate user accounts.

Doctor:
View nurse data for collaboration.
Modify patient data and manage assignments.

Nurse:
View patient data assigned by doctors.
Update treatment progress for patients.

Patient:
View personal medical records and assigned treatments.
Update personal information (e.g., address, contact details)


Key Functionalitis

Authentication:
Secure registration and login using JSON Web Tokens (JWT).
Password hashing with bcrypt for secure storage.

Authorization:
Role-based access control enforced at the route level using custom middleware.

RESTful APIs:
Modularized APIs for user, role, and resource management.

Frontend:
Responsive and user-friendly interface for managing hospital operations.

Tech Stack

Backend:

Node.js with Express.js for server-side logic.

MongoDB for database management.

Mongoose for schema validation.

TypeScript for type safety and enhanced development experience.

Frontend:

React.js with TypeScript for the user interface.

Axios for API integration.

Tailwind CSS (or any preferred CSS framework) for styling.


Installation and Setup

Prerequisites

Node.js and npm/yarn installed

MongoDB instance running locally or on the cloud
