import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Link } from "react-router";
import { RouterProvider } from "react-router/dom";
import UploadForm from "./upload";
import Heading from "./heading";
import PointNetPage from "./PointNetPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <p>
          Upload: <Link to="/upload">Upload Page</Link>
        </p>
        <p>
          View: <Link to="/view">View Page</Link>
        </p>
        <p>
          PointNet: <Link to="/PointNetPage">PointNet++ Page</Link>
        </p>
      </div>
    ),
  },
  {
    path: "/upload",
    element: <UploadForm />,
  },
  {
    path: "/PointNetPage",
    element: <PointNetPage />,
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="font-sans">
      <Heading />
      <RouterProvider router={router} />
    </div>
  </StrictMode>
);
