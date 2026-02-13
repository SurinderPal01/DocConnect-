import { useEffect , useState } from "react";
import api from "../../utils/api";
import Loader from "../../components/Loader";
import { formatTime, formatDate } from "../../utils/time";
import SkeletonBooking from "../../components/skeltonBookings";
import "../../styles/doctorbooking.css";
import { useNavigate } from "react-router-dom";


function DoctorAppointment(){
   const [bookings, setBookings] = useState([]);
   const [loading , setLoading] = useState(true);
   const [actionId , setActionId] = useState(null);
  const navigate = useNavigate();
   useEffect(()=>{
      api.get("/api/appointment/doctor")
      .then(res=>{setBookings(res.data)
    console.log("data",res.data)})  
      .finally(()=>setLoading(false));
   },[]);



   const updateStatus=(id , status)=>{
      setBookings(prev=>
         prev.map(b=>
            b._id === id ? {...b, status} :b
         )
      )
   }
   //actions 
   const accept = async (id)=>{
      setActionId(id);
      try{
         await api.put(`/api/appointment/${id}/accept`);
         updateStatus(id,"accepted");
      }finally{
         setActionId(null);
      }
   }

   const reject = async (id)=>{
      setActionId(id);
    try {
      await api.put(`/api/appointment/${id}/reject`);
      updateStatus(id, "rejected");
    } finally {
      setActionId(null);
    }
  };

  // if(loading) return <Loader />
  if (loading) {
  return (
    <div className="my-bookings-page">
      <h2>My Bookings</h2>
      {[1,2,3].map(i => (
        <SkeletonBooking key={i} />
      ))}
    </div>
  );
}

  return (
  <div className="my-bookings-page">
    <h2 className="page-title">My Bookings</h2>

    {bookings.length === 0 && <p className="empty-text">No bookings found</p>}

    <div className="bookings-grid">
      {bookings.map(b => (
        <div key={b._id} className={`booking-card`}>
          
          {/* Left Side: Patient Info + Status + Actions */}
          <div className="card-left">
            <h4>{b.user?.firstName} {b.user?.lastName}</h4>
            <p className="patient-label">Patient</p>
            
            <span className={`status ${b.status}`}>
              {b.status}
            </span>

            <div className="card-actions">
                <button
                className="view-btn"
                onClick={() => navigate(`/dashboard/appointment/${b._id}`)}
                >
                View
                </button>

                {b.status === "pending" && (
                <>
                    <button
                    className="accept-btn"
                    disabled={actionId === b._id}
                    onClick={() => accept(b._id)}
                    >
                    Accept
                    </button>

                    <button
                    className="reject-btn"
                    disabled={actionId === b._id}
                    onClick={() => reject(b._id)}
                    >
                    Reject
                    </button>
                </>
                )}
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
);

};
export default DoctorAppointment;