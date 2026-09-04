import Home from "./pages/Home";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import InvestigationDetails from "./pages/InvestigationDetails";
import Investigate from "./pages/Investigate";
import Investigations from "./pages/Investigations";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public routes */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />

            <Route
  path="/investigate"
  element={
    <AppLayout>
      <Investigate />
    </AppLayout>
  }
/>

<Route
  path="/investigations"
  element={
    <AppLayout>
      <Investigations />
    </AppLayout>
  }
/>

            <Route
              path="/investigations/:id"
              element={
                <AppLayout>
                  <InvestigationDetails />
                </AppLayout>
              }
            />
          </Route>

          {/* Default */}
          <Route path="/" element={<Home />} />

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;