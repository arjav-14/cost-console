# Expense Management System

A full-stack expense management application with user authentication and admin dashboard.

## Features

- User authentication (login/signup)
- Role-based access control (Admin/User)
- Expense tracking and management
- Admin dashboard for expense approval
- Responsive design
- Secure JWT authentication

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **UI Components**: Shadcn/ui, Lucide Icons

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher) or Yarn
- MongoDB (local or cloud instance)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/cost-console.git
cd cost-console
```

### 2. Install dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/expense-tracker

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# Admin User (optional, for initial setup)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### 4. Create Admin User (Optional)

To create an initial admin user, run:

```bash
cd server
node createAdmin.js
```

## Running the Application

### Start the Backend Server

```bash
cd server
npm start
```

The backend server will start on `http://localhost:5000`

### Start the Frontend Development Server

In a new terminal window:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Project Structure

```
cost-console/
├── public/               # Static files
├── server/               # Backend server
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── server.js         # Server entry point
├── src/
│   ├── assets/           # Static assets
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── App.jsx           # Main App component
│   └── main.jsx          # Application entry point
├── .env.example          # Example environment variables
└── package.json          # Project dependencies
```

## Default Credentials

- **Admin User**:
  - Email: admin@example.com
  - Password: admin123

- **Regular User**:
  - Register a new account through the signup page

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `GET /api/expenses` - Get all expenses (admin only)
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense status (admin only)

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/97ffbbba-e738-4f9f-a372-fe54af0330b3) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
