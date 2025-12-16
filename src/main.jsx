import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Toaster } from "react-hot-toast";

import "./index.css";

import { UserRouter } from "./routes/UserRouter";
import { AuthRouter } from "./routes/AuthRouter";
import { AdminRouter } from "./routes/AdminRouter";

const router = createBrowserRouter([
  ...AuthRouter,
  ...UserRouter,
  ...AdminRouter,
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <>
    <RouterProvider router={router} />
  </>,
);
