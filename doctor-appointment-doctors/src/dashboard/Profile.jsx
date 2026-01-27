import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import UserProfile from "./user/UserProfile";
import DoctorProfile from "./doctor/DoctorProfile";
import Loader from "../components/Loader";

function Profile(){
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
    return user.role==="doctor" ? <DoctorProfile user={user}/> : <UserProfile user={user} />;
}
export default Profile;
