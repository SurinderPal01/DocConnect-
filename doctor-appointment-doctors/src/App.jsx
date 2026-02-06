
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "./context/useAuth";

import PublicLayout from "./layout/PublicLayout";
import DashboardLayout from "./layout/DashboardLayout";
import Loader from "./components/Loader";

/* ================= PUBLIC PAGES ================= */
const Home = lazy(() => import("./pages/home"));
const Signup = lazy(() => import("./pages/signup"));
const SignupUser = lazy(() => import("./pages/signupUser"));
const Login = lazy(() => import("./pages/login"));
const PublicDoctors = lazy(() => import("./pages/PublicDoctors"));
const PublicDoctorDetail = lazy(() => import("./pages/PublicDoctorDetail"));

/* ================= DASHBOARD PAGES ================= */
const Dashboard = lazy(() => import("./dashboard/Dashboard"));
const Profile = lazy(() => import("./dashboard/Profile"));
const Appointments = lazy(() => import("./dashboard/Appointments"));
const DoctorAvailability = lazy(() => import("./dashboard/doctor/DoctorAvailability"));
const DoctorSearch = lazy(() => import("./dashboard/search/DoctorSearch"));
const DoctorDetails = lazy(() => import("./dashboard/user/DoctorDetails"));
const AppointmentDetails = lazy(() => import("./dashboard/AppointmentDetails"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Chat = lazy(() => import("./pages/Chat"));

function App() {
  const { loading } = useAuth();
  if (loading) return <Loader />;

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* ========== PUBLIC ROUTES ========== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signupuser" element={<SignupUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctors" element={<PublicDoctors />} />
          <Route path="/doctor/public/:id" element={<PublicDoctorDetail />} />
        </Route>

        {/* ========== PROTECTED ROUTES ========== */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/appointments" element={<Appointments />} />
          <Route path="/dashboard/availability" element={<DoctorAvailability />} />
          <Route path="/dashboard/search" element={<DoctorSearch />} />
          <Route path="/doctor/:doctorId" element={<DoctorDetails />} />
          <Route path="/dashboard/appointment/:id" element={<AppointmentDetails />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/chat/:appointmentId" element={<Chat />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
