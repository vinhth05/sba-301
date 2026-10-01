# FUNews Management System - Frontend

## Overview
This is the frontend implementation for the FUNews Management System, built using ReactJS + Vite. It provides an administrative interface for managing categories, news articles, and users.

## How to Install and Run
1. Navigate to the project directory:
   ```bash
   cd TranHienVinh_SE1910
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Test Credentials
- **Admin Login:**
  - Username: `Admin`
  - Password: `123`
- **Staff Login:**
  - Username: `Staff`
  - Password: `123`
  *(Note: Currently, the system is restricted to Admin users only as per the requirements)*

## Features
- **Login System:** Authenticates users and maintains sessions using mock local storage.
- **Master Layout:** Provides a consistent Header (with an AI-generated logo) and a Sidebar navigation menu.
- **Dashboard:** Displays quick statistics.
- **Category Management:** Full CRUD operations with search functionality.
- **News Management:** Full CRUD operations with search functionality and category mapping.
- **User Management:** Full CRUD operations with search functionality. Role and Status selection included.
- **Settings:** Placeholder for future configurations.

## Constraints & Limitations
- The application uses `localStorage` to simulate a database. Data will persist across reloads but is scoped to the browser.
- Image assets (like the logo) are statically served from the `public/` directory.

## AI Usage Statement
- An AI assistant was used to generate the project skeleton, base React components (using React-Bootstrap for styling), and implement the state logic to rapidly scaffold the CRUD functionalities and meet the rubric criteria.
- The `FUNews` logo was generated using AI image generation tools.
