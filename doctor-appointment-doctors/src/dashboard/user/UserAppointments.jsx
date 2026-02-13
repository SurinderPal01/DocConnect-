import { useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Loader from "../../components/Loader";
import { formatTime, formatDate } from "../../utils/time";
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

    if(loading)return  <Loader />

    return(
        <div className="user-appointments-page">
        <h1 className="page-title">My Appointments</h1>

        {appointments.length === 0 && (
            <p className="empty-text">No Appointments</p>
        )}

        <div className="appointments-list">
            {appointments.map(b => (
            <div key={b._id} className={`appointment-card`}>
                
                {/* Left Side: Doctor Info + Status + Actions */}
                <div className="card-left">
                    <h3>
                        Dr. {b.doctor.firstName} {b.doctor.lastName}
                    </h3>
                    <p className="specialization">
                        {b.doctor.specialization}
                    </p>
                    <span className={`status ${b.status}`}>
                        {b.status}
                    </span>

                    <div className="card-actions">
                        <button className="view-btn" onClick={()=>navigate(`/dashboard/appointment/${b._id}`)}>View</button>
                    </div>
                </div>

                {/* Right Side: Date & Time */}
                <div className="card-right">
                    <p className="appointment-date">
                        {formatDate(b.date || b.start)}
                    </p>
                    <p className="appointment-time">
                        {formatTime(b.start)} - {formatTime(b.end)}
                    </p>
                </div>

            </div>
            ))}
        </div>
        </div>

    )

}

export default UserAppointments;