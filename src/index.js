import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import { UserProvider } from "./contexts/UserContext.js";
import AuthForm from "./pages/auth/AuthForm.js";
import GuestRoute from "./routes/GuestRoute.js";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
      path: "/",
      element: <App />,
      children: [
          {
              path: "auth", // Path for the authentication form
              element: (
                  <GuestRoute>
                      <AuthForm /> {/* Render the AuthForm within the GuestRoute */}
                  </GuestRoute>
              ),
          },
          {
              path: "*", // Catch-all for undefined routes
              element: <NotFound />, // Redirect all undefined routes to NotFound component
          },
      ],
  },
], {
  future: {
      v7_relativeSplatPath: true, // Enable future relative splat path behavior
  },
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

