import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewUser from "./pages/NewUser";
import MemberHome from "./pages/MemberHome";
import TrainerHome from "./pages/TrainerHome";
import AdminHome from "./pages/AdminHome";
import Login from "./pages/Login";
import ResetPasswordPage from "./pages/ResetPassword";
import ClassList from "./pages/ClassListing";
import Signup from "./pages/SignUp";
import MembershipPage from "./pages/MembershipPage";
import PricingPage from "./pages/PricingPage";
import RegistrationForm from "./pages/RegistrationForm";
import ContactPage from "./pages/ContactPage";
import Profile from "./pages/Profile";
import Progress from "./pages/Progress";
import ManageMembership from "./pages/ManageMembership";
import Payment from "./pages/Payment";
import PaymentResult from "./pages/PaymentResult";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes with common layout and navbar */}
          <Route element={<Layout />}>
            <Route path="/" element={<NewUser />} />
            <Route
              path="/member"
              element={
                <ProtectedRoute requiredRole="member">
                  <MemberHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainer"
              element={
                <ProtectedRoute requiredRole="trainer">
                  <TrainerHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
            <Route path="/classes" element={<ClassList />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/success"
              element={
                <ProtectedRoute>
                  <PaymentResult />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cancel"
              element={
                <ProtectedRoute>
                  <PaymentResult />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-membership"
              element={
                <ProtectedRoute>
                  <ManageMembership />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Routes that don't require the common layout */}
          {/* Unauthorized route */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
