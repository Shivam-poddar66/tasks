# Diploy - WooCommerce Product Management System

A full-stack web application that allows sellers to create and manage products, with automatic synchronization to WooCommerce stores.

## Features

- User Authentication (Register/Login)
- Product Management (CRUD operations)
- WooCommerce Integration
- Real-time Product Status Tracking
- Modern and Responsive UI
- Secure API with JWT Authentication

## Tech Stack

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- WooCommerce REST API

### Frontend
- React.js
- Material-UI
- React Router
- Axios
- Context API for State Management

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- XAMPP (or any other local development environment)
- WooCommerce Store with API credentials

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Shivam-poddar66/task.git
cd task
```

2. Set up the database:
- Open MySQL command line or phpMyAdmin
- Import the `database.sql` file to create the database and tables

3. Backend Setup:
```bash
cd backend
npm install
```

4. Create `.env` file in the backend directory with the following content:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=diploy_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h

# WooCommerce Configuration
WC_URL=your_woocommerce_store_url
WC_CONSUMER_KEY=your_consumer_key
WC_CONSUMER_SECRET=your_consumer_secret
```

5. Frontend Setup:
```bash
cd frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Products
- GET `/api/products` - Get all products for the authenticated user
- POST `/api/products` - Create a new product
- PUT `/api/products/:id` - Update a product
- DELETE `/api/products/:id` - Delete a product

## WooCommerce Integration

The application automatically syncs products with your WooCommerce store. To set up WooCommerce integration:

1. Log in to your WordPress admin panel
2. Go to WooCommerce → Settings → Advanced → REST API
3. Click "Add key"
4. Fill in the description and set permissions
5. Click "Generate API key"
6. Copy the Consumer Key and Consumer Secret
7. Add these credentials to your backend `.env` file

## Project Structure

```
diploy/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── App.js
│   └── package.json
└── database.sql
```

## Features in Detail

### User Authentication
- Secure registration and login system
- JWT-based authentication
- Protected routes and API endpoints

### Product Management
- Create products with name, description, price, and image
- View list of created products
- Edit existing products
- Delete products
- Automatic WooCommerce synchronization

### Product Status Tracking
- Created Locally
- Synced to WooCommerce
- Sync Failed

### Security Features
- Password hashing
- JWT token authentication
- Protected API endpoints
- Input validation
- Error handling


This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email [shivamnnr66@example.com] or open an issue in the repository. 