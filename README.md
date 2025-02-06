# Currency Exchange Mobile Application

**Student Name:** Ahmet Artun Bostan  
**Student ID:** 39810

## Project Overview
This project implements a comprehensive mobile currency exchange system that allows users to perform currency exchange operations, track exchange rates, and manage their virtual currency portfolio. The system integrates with the National Bank of Poland's API (NBP API) for real-time exchange rate data.

## Features

### Mobile Application
- **User Account Management**
  - Account creation and authentication
  - Secure login system
  - Profile management

- **Currency Operations**
  - Real-time exchange rate viewing
  - Historical exchange rate analysis
  - Currency exchange between multiple currencies
  - Virtual account funding

- **Balance Management**
  - Multi-currency wallet support
  - Transaction history
  - Balance tracking in different currencies

### Web Service (REST API)
- **Authentication Endpoints**
  - `/api/auth/register` - User registration
  - `/api/auth/login` - User authentication

- **Transaction Endpoints**
  - `/api/transactions/rates` - Current exchange rates
  - `/api/transactions/rates/historical/:date` - Historical rates
  - `/api/transactions/exchange` - Currency exchange
  - `/api/transactions/deposit` - Account funding

- **NBP API Integration**
  - Real-time exchange rate fetching
  - Historical data retrieval
  - Automatic rate updates

## Technical Stack

### Frontend
- **Framework:** React Native
- **State Management:** Zustand
- **Navigation:** React Navigation
- **UI Components:** Native Base
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **API Integration:** NBP API

## Database Design
- **Users Collection:** Stores user information and balances
- **Transactions Collection:** Records all currency operations
- **Indexes:** Optimized for query performance
- **Data Validation:** Ensures data integrity

## Technologies and Languages Used

### Programming Languages
- **JavaScript/TypeScript**
  - Frontend (React Native)
  - Backend (Node.js)
- **SQL** (for database queries)

### Frontend Technologies
- **React Native** (v0.72.6)
  - Cross-platform mobile development
  - Native UI components
- **TypeScript** (v4.9.5)
  - Type-safe development
  - Better IDE support
- **React Navigation** (v6.1.9)
  - Stack navigation
  - Tab navigation
- **Axios** (v1.6.2)
  - HTTP client
  - API requests
- **AsyncStorage**
  - Local data persistence
  - Token storage
- **Native Base**
  - UI components
  - Responsive design

### Backend Technologies
- **Node.js** (v18.18.0)
  - JavaScript runtime
  - Server-side development
- **Express.js** (v4.18.2)
  - Web framework
  - REST API development
  - Middleware support
- **MongoDB** (v6.0)
  - NoSQL database
  - Flexible schema
  - Scalable data storage
- **Mongoose** (v7.6.3)
  - MongoDB ODM
  - Schema validation
  - Query building
- **JWT** (jsonwebtoken v9.0.2)
  - Authentication
  - Token-based security
- **Bcrypt** (v5.1.1)
  - Password hashing
  - Security enhancement
- **CORS**
  - Cross-origin resource sharing
  - API security

### Development Tools
- **Visual Studio Code**
  - Code editing
  - Debugging
- **Postman**
  - API testing
  - Endpoint documentation
- **Git**
  - Version control
  - Code management
- **npm**
  - Package management
  - Dependency control

### Database
- **MongoDB**
  - Version: 6.0
  - Type: NoSQL
  - Features:
    - Document-based storage
    - ACID transactions
    - Indexing support
    - Aggregation pipeline
    - Replication support
  - Collections:
    - Users
    - Transactions
    - Exchange Rates

### APIs
- **NBP API**
  - Polish National Bank API
  - Exchange rate data source
  - Historical rates access
  - Multiple currency support

## Documentation
- Functional and non-functional requirements
- Use case diagrams
- Class diagrams
- Database schema design
- API documentation

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- React Native development environment

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd currency-exchange-app
npm install
npm start
```

## Environment Configuration
Create a `.env` file in the backend directory:
```env
PORT=5050
MONGODB_URI=mongodb://127.0.0.1:27017/currency-exchange
JWT_SECRET=your_jwt_secret
```

## Testing
The application includes comprehensive testing:
- API endpoint testing
- User authentication testing
- Currency exchange operations testing
- Database operations testing

## Security Features
- Password hashing
- JWT authentication
- Input validation
- Rate limiting
- CORS protection

## Error Handling
- Comprehensive error messages
- Transaction rollback support
- API error responses
- Client-side validation

## Future Improvements
1. End-to-end testing implementation
2. Swagger/OpenAPI documentation
3. Docker containerization
4. CI/CD pipeline setup
5. Real-time exchange rate updates
6. Additional currency support

## License
This project is created as part of a university assignment.

## Author
**Ahmet Artun Bostan**  
Student ID: 39810

## Acknowledgments
- National Bank of Poland for providing the exchange rate API
- React Native community for the comprehensive mobile development framework
- MongoDB team for the robust database system
