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
  - [Technical Desicions and Architecture](#technical-desicions-and-architecture)
    - [State Management](#state-management)
  - [Modal Implementation](#modal-implementation)
  - [Multiple CVs per user](#multiple-cvs-per-user)
    - [UI/UX Choises](#uiux-choises)
    - [Testing strategy](#testing-strategy)
    - [Development Decisions](#development-decisions)
  - [Routes](#routes)
    - [Protected Routes](#protected-routes)
    - [Public Routes](#public-routes)
  - [API Integration](#api-integration)
  - [API Endpoints](#api-endpoints)
    - [User Management](#user-management)
    - [CV Management](#cv-management)
    - [Authentication](#authentication)
    - [Error Handling](#error-handling)
  - [Some Future Improvements](#some-future-improvements)
    - [Smart CV Content Assistant](#smart-cv-content-assistant)
    - [Advanced Template System](#advanced-template-system)
    - [Data Import/Export Capabilities](#data-importexport-capabilities)
    - [Analytics Dashboard](#analytics-dashboard)
    - [Enhanced Mobile Experience](#enhanced-mobile-experience)
## Description
A CV builder web application built with React and TypeScript that enables users to create, manage, and export professional CVs. Features role-based access control, PDF export functionality, and a responsive user interface.

## Features
- 🔐 Role-based authentication (Admin/User)
- 📝 Dynamic CV creation and editing
- 📄 PDF export functionality
- 🎨 Responsive UI
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
git clone https://github.com/torildhov/eksamen-javascript-rammeverk.git

cd eksamen-javascript-rammeverk
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm run dev
```

**Note**: The API key is stored in a .env file that is included in the repository. This is done on purpose because this is an exam project.

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

## Technical Desicions and Architecture
### State Management
Redux Toolkit was chosen for its state management capabiliteis. Chosen over Context API due to:
- Complex state interactions between users and CVs
- Need for predictable state updates
- Support for async operations like createAsyncThunk

## Modal Implementation
The choise to implement modals for editing users and CVs instead of separate routes was deliberate:
- Maintains user context and workflow
- Reduces navigation complexity
- Improves user experience with immediate feedback
- Simplifies state management during editing

## Multiple CVs per user
The application allows users to create multiple CVs:
- users can maintain different versions of their CVs
- allows users to keep CVs for different languages
- A/B testing for different CV content
- historical CVs for reference

### UI/UX Choises
- TailWingCSS was chosen for its utility classes and ease of use
- React-PDF selected for PDF generation and preview
- React Hot Toast for intuitive and non-intrusive notifications
- Lottie hero animation for fun!

### Testing strategy
Jest and Testing Library for testing. Mocked API calls for testing.
- API calls
- authentication and authorization
- CV export
- CV operations
- user operations
- store
- CV form validation
- login form validation
- user form validation

### Development Decisions
- Typescript for type safety and better developer experience
- Redux Toolkit for state management
- React Router for navigation

## Routes
### Protected Routes
The following routes are protected and require authentication:
- `/dashboard`: Dashboard page.
- `/dashboard/cvs`: Create CV page.
- `/dashboard/cvs/:id`: CV export page.
- `/dashboard/users`: Create user page for admins.

### Public Routes
The following routes are public and accessible without authentication:
- `/`: Login page.

## API Integration
The application uses https://crudapi.co.uk API for data storage and retrieval.

## API Endpoints 
The CRUD API provides the following endpoints for user and CV management:
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

## Some Future Improvements

### Smart CV Content Assistant
The application could integrate AI-powered writing assistance to help users create CVs. This would include keyword optimization based on job descriptions, grammar improvements, and industry-specific content suggestions.

### Advanced Template System
Implementing a flexible template system would allow users to choose from multiple professional designs and customize colors, fonts, and layouts. This would give users more creative control while maintaining professional standards across all CV versions. Also a profile picture upload feature.

### Data Import/Export Capabilities
Integration with professional platforms like LinkedIn would streamline the CV creation process. Users could import their professional history and export their CVs to various formats beyond PDF, making the system more versatile.

### Analytics Dashboard
A comprehensive analytics system would show users how their CVs perform, including viewing statistics and download count. This data would help users optimize their CVs for better results in job applications.

### Enhanced Mobile Experience
While the current system is responsive, a dedicated mobile experience would allow users to make quick updates to their CVs from any device. This would include optimized mobile viewing and editing interfaces.