import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import DoctorAppointments from "./doctor/DoctorAppointments";
import UserAppointments from "./user/UserAppointments";
import Loader from "../components/Loader";
import BookAppointment from "./user/BookAppointment";

function Appointments(){
         const {user , loading} = useAuth();
    const navigate = useNavigate();
      useEffect(()=>{
    if(loading) return;
    if(!user){
      navigate("/login");
    }
  },[loading,user , navigate]);
  
  if (loading) return <Loader />;
  if (!user) return null;
   return user.role==="doctor" ?<DoctorAppointments /> : <UserAppointments /> 
}
export default Appointments;