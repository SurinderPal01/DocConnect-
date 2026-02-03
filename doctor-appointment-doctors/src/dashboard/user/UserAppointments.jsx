import { useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Loader from "../../components/Loader";
import { to12Hour } from "../../utils/time";
import "../../styles/userappointments.css";

function UserAppointments(){
    const [appointments , setAppointments] = useState([])
    const [loading , setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(()=>{
        try{
             api.get("/api/appointment/user")
            .then(res=>setAppointments(res.data))
            .finally(()=>setLoading(false))
        }catch(err){
            console.error("Error is",err);
        }
    },[]);

    const handleCancel = async(id)=>{
        if(!confirm("Cancel This Appointment?")) return;
        await api.put(`/api/appointment/${id}/cancel`);
        setAppointments(prev=>
            prev.map(a=>
                a._id===id ? {...a, status:"cancelled"} :a
            )
        )
    }

    if(loading)return  <Loader />

    return(
        <div className="user-appointments-page">
        <h1 className="page-title">My Appointments</h1>

        {appointments.length === 0 && (
            <p className="empty-text">No Appointments</p>
        )}

        <div className="appointments-list">
            {appointments.map(b => (
            <div key={b._id} className={`appointment-card ${b.status}`}>
                
                {/* Doctor Info */}
                <div className="user-doctor-info">
                <h3>
                    Dr. {b.doctor.firstName} {b.doctor.lastName}
                </h3>
                <p className="specialization">
                    {b.doctor.specialization}
                </p>
            <button className="view-btn" onClick={()=>navigate(`/dashboard/appointment/${b._id}`)}>View</button>

                </div>
                {/* Appointment Info */}
                <div className="appointment-info">
                <p className="slot">
                    {b.day} | {to12Hour(b.start)} - {to12Hour(b.end)}
                </p>
                <span className={`status ${b.status}`}>
                    {b.status}
                </span>
                {(b.status==="pending" || b.status==="approved") &&(
                    <button className="cancel-btn"
                    onClick={()=>handleCancel(b._id)}>
                    Cancel</button>
                )}
                </div>

            </div>
            ))}
        </div>
        </div>

    )

}

export default UserAppointments;