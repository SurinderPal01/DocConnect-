import { useEffect , useState } from "react";
import api from "../../utils/api";
import Loader from "../../components/Loader";
import { to12Hour } from "../../utils/time";
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
      .then(res=>setBookings(res.data))
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

  const cancel = async (id) => {
    if (!confirm("Cancel this booking?")) return;

    setActionId(id);
    try {
      await api.put(`/api/appointment/${id}/cancel`);
      updateStatus(id, "cancelled");
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

    {bookings.length === 0 && <p>No bookings found</p>}

    <div className="bookings-grid">
      {bookings.map(b => (
        <div key={b._id} className={`booking-card ${b.status}`}>
          
          {/* INFO */}
          <div className="booking-info">
            <h4>{b.user?.firstName} {b.user?.lastName}</h4>

            <p className="slot">
              {b.day} | {to12Hour(b.start)} - {to12Hour(b.end)}
            </p>

            <span className={`status ${b.status}`}>
              {b.status}
            </span>

            <button
              className="view-btn"
              onClick={() => navigate(`/dashboard/appointment/${b._id}`)}
            >
              View
            </button>
          </div>

          {/* ACTIONS */}
          <div className="booking-actions">
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

            {b.status === "accepted" && (
              <button
                className="cancel-btn"
                disabled={actionId === b._id}
                onClick={() => cancel(b._id)}
              >
                Cancel
              </button>
            )}
          </div>

        </div>
      ))}
    </div>
  </div>
);

};
export default DoctorAppointment;