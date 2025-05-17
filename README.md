# Countries Explorer Application

## 🌍 Live Demo
* [https://country-app-zcpg.vercel.app/](https://country-app-zcpg.vercel.app/)


## 📋 Project Overview
This application is a comprehensive countries explorer built with React for the frontend and a custom backend for user management. It integrates with the REST Countries API to provide detailed information about countries worldwide, allowing users to search, filter, and view specific details about any country.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React (with functional components)
- **Language**: JavaScript
- **CSS Framework**: Tailwind CSS
- **Testing**: Jest and React Testing Library
- **Hosting**: Vercel

### Backend
- **Framework**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Hosting**: Railway

## ✨ Features
- **Country Information Display**: View comprehensive details about countries including name, population, region, languages, flag, and capital.
- **Search Functionality**: Search for countries by name.
- **Filtering Options**: Filter countries by region and language.
- **Detailed View**: Click on any country to view expanded information.
- **User Authentication**: Register and login to access personalized features.
- **Favorites System**: Authenticated users can save countries to their favorites list.
- **Responsive Design**: Optimized viewing experience across all device types.

## 🔌 API Integration
The application integrates with the REST Countries API using the following endpoints:

1. `GET /all` - Retrieves a list of all countries
2. `GET /name/{name}` - Searches for countries by name
3. `GET /region/{region}` - Filters countries by region
4. `GET /alpha/{code}` - Gets detailed information about a specific country using its code

## 🚀 Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-dasundu.git
   ```
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file and add the following environment variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
5. Start the development server:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=[your-mongodb-connection-string]
   JWT_SECRET=[your-jwt-secret]
   ```
4. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`

## 🧪 Running Tests
The project includes comprehensive tests for the frontend components and functions.

To run the tests:
```bash
cd frontend
npm test
```

For test coverage report:
```bash
npm test -- --coverage
```



## 🔒 Authentication Flow
1. User registers with email and password
2. Backend validates the data and creates a new user in the database
3. User logs in with credentials
4. Backend validates credentials and issues a JWT token
5. Frontend stores the token in localStorage for subsequent requests
6. Protected routes verify the token before granting access

## 🌟 Key Features Implementation

### Country Search and Filtering
The application implements real-time search functionality, allowing users to find countries by name instantly. Additionally, users can filter countries by region and language, with the filters being combinable to narrow down results.

### Favorites System
Authenticated users can add countries to their favorites list. This information is stored in the backend database, allowing users to access their favorites across devices and sessions.

### Responsive Design
Using Tailwind CSS, the application provides a seamless experience across mobile, tablet, and desktop devices. The layout adapts intelligently based on screen size.

## 🚧 Challenges and Solutions

### Challenge 1: API Rate Limiting
**Problem**: The REST Countries API occasionally enforced rate limits during development.

**Solution**: Implemented caching mechanisms to store API responses and reduce the number of requests. Also added error handling to gracefully handle rate limit errors.

### Challenge 2: State Management
**Problem**: Managing global state across components became complex as the application grew.

**Solution**: Utilized React Context API for global state management, particularly for authentication and favorites functionality, simplifying data flow throughout the application.

### Challenge 3: Performance Optimization
**Problem**: Initial loading of all countries caused performance issues.

**Solution**: Implemented lazy loading and pagination to load countries in smaller batches as needed, significantly improving initial load times.

## 🔮 Future Improvements
- Add dark mode toggle
- Implement more detailed country statistics and visualizations
- Add language translation features
- Enhance the favorites system with categories and notes
- Implement offline functionality using service workers
