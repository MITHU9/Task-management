import App from "../App";
import Login from "../pages/Login";
import { createBrowserRouter } from "react-router-dom";
import Register from "../pages/Register";
import Home from "../pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/home",
    element: <Home />,
  },
]);

export default router;
