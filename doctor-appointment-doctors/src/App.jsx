import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/useAuth";

import PublicLayout from "./layout/PublicLayout";
import DashboardLayout from "./layout/DashboardLayout";
import Loader from "./components/Loader";
import Home from "./pages/home";
import Signup from "./pages/signup";
import SignupUser from "./pages/signupUser";
import Login from "./pages/login";
import Notifications from "./pages/Notifications";

import Dashboard from "./dashboard/Dashboard";
import Profile from "./dashboard/profile";
import Appointments from "./dashboard/Appointments";
import Chat from "./pages/Chat";
import DoctorSearch from "./dashboard/search/DoctorSearch";
import DoctorAvailability from "./dashboard/doctor/DoctorAvailability";
import DoctorDetails from "./dashboard/user/DoctorDetails";
import AppointmentDetails from "./dashboard/AppointmentDetails";
import PublicDoctors from "./pages/PublicDoctors";
import PublicDoctorDetail from "./pages/PublicDoctorDetail";
function App() {
  const { loading } = useAuth();
  if (loading) return <Loader />;

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signupuser" element={<SignupUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctors" element={<PublicDoctors />} />
        <Route path="/doctor/public/:id" element={<PublicDoctorDetail />} />
      </Route>

      {/* PROTECTED ROUTES */}
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
  );
}

export default App;
