import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import { UserProvider } from "./contexts/UserContext.js";
import GuestRoute from "./routes/GuestRoute.js";
import NotFound from "./pages/NotFound";
import BookingComponent from "./components/BookingComponent.js";
import AllCars from "./components/AllCars.js";
import BookedDates from "./components/BookedDates.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import AboutUs from "./pages/AboutUs";
import Reviews from "./pages/Reviews.js";
import Contact from "./pages/Contact.js";
import SignInForm from "./pages/auth/SignInForm.js";
import SignUpForm from "./pages/auth/SignUpForm.js";

const router = createBrowserRouter([
  {
      path: "/",
      element: <App />,
      children: [
        {
          path: "", // Default route will render About Us
          element: <AboutUs />,
        },
      {
        path: "/about-us", // Add route for About Us
        element: <AboutUs />,
      },
        {
            path: "/booking",
            element: <BookingComponent></BookingComponent>,
        },
        {
          path: "/browse-cars",
          element: <AllCars></AllCars>,
        },
          {
              path: "/signin",
              element: (
                  <GuestRoute>
                      <SignInForm />
                  </GuestRoute>
              ),
          },
          {
            path: "/signup",
            element: (
                <GuestRoute>
                    <SignUpForm />
                </GuestRoute>
            ),
        },
          {
            path: "/my-rentals",
            element: <BookedDates></BookedDates>,
          },
          {
            path: "/reviews",
            element: <Reviews />,
          },
          {
            path: "/contact",
            element: <Contact />,
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