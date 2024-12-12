# CV Builder Pro

## Table of Contents
- [CV Builder Pro](#cv-builder-pro)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage Guide](#usage-guide)
    - [Default Login Credentials](#default-login-credentials)
    - [Admin Only Features](#admin-only-features)
    - [User Features (including Admin)](#user-features-including-admin)
  - [Testing](#testing)
  - [Project Structure](#project-structure)
  - [Routes](#routes)
    - [Protected Routes](#protected-routes)
    - [Public Routes](#public-routes)
  - [API Integration](#api-integration)
  - [API Endpoints](#api-endpoints)
    - [User Management](#user-management)
    - [CV Management](#cv-management)
    - [Authentication](#authentication)
    - [Error Handling](#error-handling)
## Description
A CV builder web application built with React and TypeScript that enables users to create, manage, and export professional CVs. Features role-based access control, PDF export functionality, and a responsive user interface.

## Features
- 🔐 Role-based authentication (Admin/User)
- 📝 Dynamic CV creation and editing
- 📄 PDF export functionality
- 🎨 Modern, responsive UI
- 🔍 Search functionality
- 👥 User management (Admin only)
## Tech Stack
- React 18
- TypeScript
- Redux Toolkit
- React Router DOM
- TailwindCSS
- React-PDF
- Jest & Testing Library

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm/yarn
- Git

### Installation

1. Clone the repository
```
git clone https://github.com/torildhov/cv-management-system.git
cd cv-management-system
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm run dev
```

## Usage Guide
### Default Login Credentials

```
Admin User:
Username: admin
Password: admin
```

### Admin Only Features
- **User Management**: Admin can view, create, edit, and delete user information.
- **CV Management**: Admin can view, edit, and delete all CVs.
- **PDF Export**: Admin can export all CVs to PDF.
- **Admin Dashboard**: Admin can view a dashboard with app statistics and user CVs.
  
### User Features (including Admin)
- **CV Creation**: Users can create, edit, and delete their own CVs.
- **Edit CV sections**:
  - Personal Information
  - Skills
  - Education
  - Work Experience
  - References
- **PDF Export**: Users can export their CV to PDF.
- **Search**: Users can search for skills by name.
- **User Dashboard**: Users can view a dashboard with their CVs and user information.

## Testing

To run the tests, use the following command:
````
npm test
````

To run a specific test file, use the following command:
````
npm test <path-to-test-file>

eg.

npm test tests/auth/login.operations.test.ts
````

## Project Structure
```
src/
├── components/         # Reusable UI components
│   ├── cv/             # CV-related components
│   ├── dashboard/      # Dashboard components
│   ├── forms/          # Form components
│   ├── lists/          # List components
│   └── ui/             # Basic UI components
├── guards/             # Auth guards
├── hooks/              # Custom React hooks
├── pages/              # Main page components
├── services/           # API services
├── store/              # Redux store
│   └── slices/         # Redux slices
├── utils/              # Utility functions
└── routes/             # Route definitions
```

## Routes
### Protected Routes
- `/dashboard`: Dashboard page.
- `/dashboard/cvs`: Create CV page.
- `/dashboard/cvs/:id`: CV export page.
- `/dashboard/users`: Create user page for admins.

### Public Routes
- `/`: Login page.

## API Integration
The application uses https://crudapi.co.uk API for data storage and retrieval.

## API Endpoints 
### User Management
**1. Get All Users**: 
- Method: GET
- Endpoint:  /users
- Response: Array of user objects

**2. Create user:**
- Method: POST
- Endpoint: /users
- Body: User object
- Response: Created user object

**3. Update user:**
- Method: PUT
- Endpoint: /users/:id
- Body: Partial User object
- Response: Updated user object

**4. Delete user:**
- Method: DELETE
- Endpoint: /users/:id
- Response: Deleted user object

### CV Management
**1. Get All CVs:**
- Method: GET
- Endpoint: /cvs
- Response: Array of CV objects

**2. Create CV:**
- Method: POST
- Endpoint: /cvs
- Body: CV object
- Response: Created CV object

**3. Update CV:**
- Method: PUT
- Endpoint: /cvs/:id
- Body: Partial CV object
- Response: Updated CV object

**4. Delete CV:**
- Method: DELETE
- Endpoint: /cvs/:id
- Response: Deleted CV object

### Authentication
- Uses Redux for state management.
- Supports following actions:
  - Login Start
  - Login Success
  - Login Fail
  - Logout

### Error Handling
All API enpoints include standard error handling with:
- Loading states
- Error messages
- Request status tracking



