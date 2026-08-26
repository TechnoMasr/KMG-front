import React, { Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router";
import App from "../App";
import LoadingPage from "../components/Loading/LoadingPage";
import ProtectedRoute from "@/components/protectRoutes/ProtectedRoute";
import AuthGuard from "@/components/protectRoutes/AuthGuard";
import VerifyEmailGuard from "@/components/protectRoutes/VerifyEmailGuard";
import CheckVerifiedEmailGuard from "@/components/protectRoutes/CheckVerifiedEmailGuard";

const Home = React.lazy(() => import("../pages/Home/Home"));

const Games = React.lazy(() => import("../pages/Games/Games"));
const GameServices = React.lazy(
  () => import("../pages/GameServices/GameServices"),
);
const AccountDetails = React.lazy(
  () => import("../pages/GameServices/pages/AccountDetails/AccountDetails"),
);

const Register = React.lazy(() => import("../pages/Register/Register"));
const VerifyEmail = React.lazy(
  () => import("../pages/VerifyEmail/VerifyEmail"),
);
const Login = React.lazy(() => import("../pages/Login/Login"));
const ForgotPassword = React.lazy(
  () => import("../pages/ForgotPassword/ForgotPassword"),
);

const Profile = React.lazy(() => import("../pages/Profile/Profile"));
const Account = React.lazy(
  () => import("../pages/Profile/pages/Account/Account"),
);
const Orders = React.lazy(() => import("../pages/Profile/pages/Orders/Orders"));
const OrderTracker = React.lazy(
  () => import("../pages/Profile/pages/Orders/OrderTracker"),
);
const Notifications = React.lazy(
  () => import("../pages/Profile/pages/Notifications/Notifications"),
);

const Chat = React.lazy(() => import("../pages/Chat/Chat"));

const SitePages = React.lazy(() => import("../pages/SitePages/SitePages"));

const Payment = React.lazy(() => import("../pages/Payment/Payment"));

const NotFound = React.lazy(() => import("../pages/NotFound/NotFound"));
const ErrorPage = React.lazy(() => import("../pages/ErrorPage/ErrorPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },

      {
        path: "/games/:service?",
        element: <Games />,
      },
      {
        path: "/games/:service/:id",
        element: <GameServices />,
      },
      {
        path: "/games/accounts/details/:id",
        element: <AccountDetails />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/profile",
            element: <Profile />,
            children: [
              { index: true, element: <Account /> },
              { path: "orders", element: <Orders /> },
              { path: "order-tracker/:id", element: <OrderTracker /> },
              { path: "notifications", element: <Notifications /> },
            ],
          },
          {
            path: "/chat",
            element: (
              <CheckVerifiedEmailGuard>
                <Chat />
              </CheckVerifiedEmailGuard>
            ),
          },
          {
            path: "/payment",
            element: (
              <CheckVerifiedEmailGuard>
                <Payment />
              </CheckVerifiedEmailGuard>
            ),
          },
        ],
      },

      { path: "/page/:slug", element: <SitePages /> },

      {
        element: <AuthGuard />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
          { path: "/forgot-password", element: <ForgotPassword /> },
        ],
      },

      {
        path: "/verify-email",
        element: (
          <VerifyEmailGuard>
            <VerifyEmail />
          </VerifyEmailGuard>
        ),
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default AppRouter;
