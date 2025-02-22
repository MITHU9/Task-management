# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Task Management Site

## 🚀 Short Description

A modern, drag-and-drop task management application built using React and TailwindCSS for seamless task organization. Supports real-time collaboration with Socket.io and efficient state management using React Query.

## 🔗 Live Demo

 <p>
 <a href="https://task-management-by-mithu9.netlify.app/">[Live_Link]</a>
 </p>

## 🛠 Technologies Used

### Frontend:

- React (^19.0.0)
- TailwindCSS (^4.0.7)
- @hello-pangea/dnd (^18.0.1) (Drag-and-drop functionality)
- @tanstack/react-query (^5.66.7) (State management)
- AOS (^2.3.4) (Animations)
- Axios (^1.7.9) (API calls)
- Firebase (^11.3.1) (Authentication & Storage)
- Lucide-react (^0.475.0) (Icons)
- React-hook-form (^7.54.2) (Form handling)
- React-loader-spinner (^6.1.6) (Loading indicators)
- React-router-dom (^7.2.0) (Routing)
- Socket.io-client (^4.8.1) (Real-time communication)

### Backend:

- Node.js
- Express.js
- MongoDB
- Socket.io

## 📦 Dependencies

Ensure you have [Node.js](https://nodejs.org/) installed.

## ⚡ Installation Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/MITHU9/Task-management.git
   cd task-management
   ```

2. **Install Frontend Dependencies:**

   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies:**

   ```bash
   cd backend
   npm install
   ```

4. **Set Up Environment Variables:**

   - Create a `.env` file in both `frontend` and `backend` directories.
   - Add necessary environment variables (e.g., API keys, database URIs, etc.).

5. **Run Backend Server:**

   ```bash
   npm start
   ```

6. **Run Frontend:**

   ```bash
   npm run dev
   ```

7. **Open the Application:**
   - Navigate to `http://localhost:5173/` (or the port assigned by Vite)

## 🎯 Features

- Drag-and-drop task management
- Real-time updates with WebSockets
- Firebase authentication
- Responsive UI with TailwindCSS
- Dark mode support

---

Happy Coding! 🚀
