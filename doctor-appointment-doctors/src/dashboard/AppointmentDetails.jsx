import { useAuth } from "../context/useAuth";
import DoctorAppointmentDetails from "../pages/doctor/DoctorAppointmentDetail";
import UserAppointmentDetail  from "../pages/user/UserAppointmentDetail";

function AppointmentDetail(){
const {user} = useAuth();
return user.role ==="doctor" ?
<DoctorAppointmentDetails />
: <UserAppointmentDetail />
}

export default AppointmentDetail;