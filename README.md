# CodemiZe - Interactive Educational Games Platform

CodemiZe is a comprehensive platform featuring multiple educational games designed to enhance learning through interactive challenges. The platform includes a variety of games like Quiz Hunters, Code Crushers, Circuit Smashers, Route Seekers, and Battle Breakers, each focusing on different educational aspects and skills.

## Features

- **Multiple Educational Games:**
  - **Quiz Hunters:** Test knowledge through engaging quizzes
  - **Code Crushers:** Learn coding concepts through interactive challenges
  - **Circuit Smashers:** Explore electronics and circuit design
  - **Route Seekers:** Navigate through problem-solving paths
  - **Battle Breakers:** Compete in educational challenges

- **Role-Based Access Control:**
  - **Students:** Participate in games and track progress
  - **Judges:** Evaluate submissions and provide feedback
  - **Administrators:** Manage users, games, and platform settings

- **Real-time Interaction:**
  - Socket-based communication for live updates
  - Interactive game roadmap visualization
  - Real-time scoring and feedback

- **Comprehensive Judging System:**
  - Detailed marking criteria
  - Transparent evaluation process
  - Feedback mechanism for continuous improvement

## Technology Stack

### Frontend

- React with JSX
- Framer Motion for animations
- Tailwind CSS for styling
- Socket.io client for real-time communication
- Vite for build optimization

### Backend

- Node.js
- Express.js
- MongoDB for data persistence
- Socket.io for real-time features
- JWT for authentication

## Project Structure

```plaintext
codemiZe/
├── backend/              # Server-side code
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middlewares
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── sockets/          # Socket.io handlers
│   ├── utils/            # Utility functions
│   └── server.js         # Entry point
│
└── frontend/             # Client-side code
    └── codemiZe/
        ├── public/       # Static assets
        └── src/
            ├── components/  # React components
            ├── context/     # React contexts
            ├── hooks/       # Custom React hooks
            ├── pages/       # Page components
            └── utils/       # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- MongoDB
- Git

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/Nipuna-Lakruwan/codemiZe.git
   cd codemiZe
   ```

2. Install backend dependencies

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies

   ```bash
   cd ../frontend/codemiZe
   npm install
   ```

4. Set up environment variables
   - Create a `.env` file in the backend directory based on the provided example
   - Create a `.env` file in the frontend/codemiZe directory if needed

### Running the Application

1. Start the backend server

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server

   ```bash
   cd ../frontend/codemiZe
   npm run dev
   ```

3. Access the application at [http://localhost:5173](http://localhost:5173)

## Deployment

The application can be deployed using various methods:

- **Backend:** Node.js hosting platforms (Heroku, Render, DigitalOcean)
- **Frontend:** Static site hosting (Netlify, Vercel, GitHub Pages)
- **Database:** MongoDB Atlas or self-hosted MongoDB

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- All contributors who have helped build and improve CodemiZe
- Educational institutions that have provided feedback and testing opportunities
