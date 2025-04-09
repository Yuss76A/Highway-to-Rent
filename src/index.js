import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import { UserProvider } from "./contexts/UserContext.js";
import AuthForm from "./pages/auth/AuthForm.js";
import GuestRoute from "./routes/GuestRoute.js";
import NotFound from "./pages/NotFound";
import BookingComponent from "./components/BookingComponent.js";
import AllCars from "./components/AllCars.js";

const router = createBrowserRouter([
  {
      path: "/",
      element: <App />,
      children: [
        {
            path: "/",
            element: <BookingComponent></BookingComponent>,
        },
        {
          path: "/browse-cars",
          element: <AllCars></AllCars>,
        },
          {
              path: "auth",
              element: (
                  <GuestRoute>
                      <AuthForm />
                  </GuestRoute>
              ),
          },
          {
              path: "*",
              element: <NotFound />,
          },
      ],
  },
], {
  future: {
      v7_relativeSplatPath: true,
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

