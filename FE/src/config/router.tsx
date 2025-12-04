import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout.tsx";
import AuthView from "../views/AuthView/AuthView.tsx";
import AuthGuard from "../guards/AuthGuard.tsx";
import NotFound from "../views/NotFound.tsx";
import DashboardView from "../views/DashboardView/DashboardView.tsx";
import { EventDashboard } from "../views/EventDashboard.tsx";
import {IncidentSuccessView} from "../views/IncidentGuidance.tsx";
import CreateUserView from "../views/Admin/CreateUserView.tsx";
import HomePage from "../views/HomePage.tsx";

export const router = createBrowserRouter([
  {
    id: "layout",
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
            <AuthGuard mustBeLoggedIn={false}>
              <DashboardView/>
            </AuthGuard>
        ),
      },
      {
        path: "/auth",
        element: (
            <AuthGuard mustBeLoggedIn={false}>
              <AuthView />
            </AuthGuard>
        ),
      },
        {
            path: "home-page",
            element: <HomePage/>
        },
      {
        path: "/event-list",
        element: (
            <AuthGuard>
              <EventDashboard />
            </AuthGuard>
        ),
      },
      {
        path: "/incident-guidance",
        element: (
              <IncidentSuccessView />
        ),
      },
        {
            path: "/admin/create-user",
            element: (
                <AuthGuard mustBeLoggedIn={true} allowedRoles={['admin']}>
                    <CreateUserView />
                </AuthGuard>
            ),
        },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);