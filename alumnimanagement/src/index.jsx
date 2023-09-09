import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// import React from "react";
// import ReactDOM from "react-dom/client";
// import { UserProvider } from "./context/UserContext";
// import {
//   createBrowserRouter,
//   RouterProvider,
//   BrowserRouter,
// } from "react-router-dom";
// import LoginPage from "../src/pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import HomePage from "./pages/HomePage";
// import App from "./App";

// const router = createBrowserRouter([
//   {
//     path: "/register",
//     element: (
//       <UserProvider>
//         <RegisterPage />
//       </UserProvider>
//     ),
//   },
//   {
//     path: "/login",
//     element: (
//       <UserProvider>
//         <LoginPage />
//       </UserProvider>
//     ),
//   },
//   {
//     path: "/home",
//     element: (
//       <UserProvider>
//         <HomePage />
//       </UserProvider>
//     ),
//   },
// ]);

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<RouterProvider router={router} />);
