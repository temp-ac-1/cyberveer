import "./App.css";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import Quiz from "./pages/Quiz";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import WriteBlog from "./pages/WriteBlog";
import OAuthSuccess from "./components/OAuthSuccess";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoutes from "./components/ProtectedRoute";
import useAuthCheck from "./hooks/useAuthCheck";
import AboutUs from "./pages/AboutUs";
import AdminDashboard from "./pages/admin/AdminDashboard";

const browserRouter = createBrowserRouter([
  { path: "/", element: <ProtectedRoutes><HomePage /></ProtectedRoutes> },
  { path: "/categories", element: <ProtectedRoutes><Categories /></ProtectedRoutes> },
  { path: "/category/:slug", element: <ProtectedRoutes><CategoryDetail /></ProtectedRoutes> },
  { path: "/quiz", element: <ProtectedRoutes><Quiz /></ProtectedRoutes> },
  { path: "/quiz/:slug", element: <ProtectedRoutes><Quiz /></ProtectedRoutes> },
  { path: "/blog", element: <ProtectedRoutes><Blog /></ProtectedRoutes> },
  { path: "/blog/:slug", element: <ProtectedRoutes><BlogDetail /></ProtectedRoutes> },
  { path: "/blog/write", element: <ProtectedRoutes><WriteBlog /></ProtectedRoutes> },
  { path: "/oauth-success", element: <OAuthSuccess /> },
  { path: "/profile", element: <ProtectedRoutes><Profile /></ProtectedRoutes> },
  { path: "/about-us", element: <ProtectedRoutes><AboutUs /></ProtectedRoutes> },
  { path: "/login", element: <AuthPage /> },
  { path: "/signup", element: <AuthPage /> },
  { path: "/auth", element: <AuthPage /> },
  { path: "/admin/dashboard", element: <AdminDashboard /> },
  { path: "*", element: <NotFound /> }
]);

function App() {
  useAuthCheck();
  return <RouterProvider router={browserRouter} />;
}

export default App;
