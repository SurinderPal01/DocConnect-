import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import UserDashboard from "./user/UserDashboard";
import DoctorDashboard from "./doctor/DoctorDashboard";
import Loader from "../components/Loader";

function DashBoard(){
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
    return user.role==="doctor"?<DoctorDashboard user={user}/> :<UserDashboard user={user}/>;
}
export default DashBoard;