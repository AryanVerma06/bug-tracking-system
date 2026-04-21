# Bug Tracking System

An automated bug tracking system built with a full-stack architecture, featuring user authentication, bug management, and a responsive frontend.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Bug Management**: Create, view, update, and track bugs
- **Dashboard**: Overview of bugs and system statistics
- **Responsive UI**: Modern React-based frontend with charts
- **Email Notifications**: Automated notifications for bug updates
- **RESTful API**: Well-structured backend API

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **nodemailer** for email notifications
- **CORS** for cross-origin requests

### Frontend
- **React** with **Vite** build tool
- **React Router** for navigation
- **Axios** for API calls
- **Recharts** for data visualization

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AryanVerma06/bug-tracking-system.git
   cd bug-tracking-system
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` directory with the following variables:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_email_password
     PORT=5000
     ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

## Usage

1. **Start the Backend**:
   ```bash
   cd backend
   npm run dev
   ```
   The server will run on `http://localhost:5000`

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

3. **Access the Application**:
   - Open your browser and navigate to `http://localhost:5173`
   - Register a new account or login with existing credentials
   - Create and manage bugs through the dashboard

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Bugs
- `GET /api/bugs` - Get all bugs
- `POST /api/bugs` - Create a new bug
- `PUT /api/bugs/:id` - Update a bug
- `DELETE /api/bugs/:id` - Delete a bug

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.