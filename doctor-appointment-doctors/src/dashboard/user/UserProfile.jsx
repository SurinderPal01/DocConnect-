import { useAuth } from "../../context/useAuth";
import {  useEffect, useState } from "react";
import EditProfile from "../../components/EditProfile";
import api from "../../utils/api";
import "../../styles/userprofile.css";

function UserProfile() {
  const { user ,loading,setLoading} = useAuth();
    // const [loading , setLoading] = useState(true);
    const [isEditing , setIsEditing] = useState(false);
  const [appointments, setAppointments] = useState([]);


const fetchAppointments = async () => {
  try {
    if(loading){
      return
    }
    const res = await api.get("/api/appointment/user");
    // console.log("res",res.data);
    setAppointments(res.data);
  } catch (err) {
    console.error(err);
  }
  // finally{
  //   setLoading(false);
  // }
};
 useEffect(() => {
    fetchAppointments();
}, []);

const handleUpdate = async (data)=>{
  try{
    setLoading(true);
    await api.put("/api/users/update",{
      data:data
    })
    fetchAppointments();
  }catch(err){
    console.error(err);
  }finally{
      setLoading(false);
    setIsEditing(false);
  }
}

  if(loading) return <Loader />
  if (!user) return <p>No Profile Data</p>;

return (
  <div className="user-profile">
    <div className="profile-header">
      <h1>User Profile</h1>
       
    </div>

    <div className="profile-card">
      {/* Left Section */}

        <div className="profile-photo">
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt="user" />
          ) : (
            <div className="avatar">👤</div>
          )}
        </div>

        <h2 className="profile-name">{user.firstName} {user.lastName}</h2>
        <span className="badge">Patient</span>


      {/* // Right Section: Move info below the name */}
       <div className="info-row">
    <label>Email</label>
    <p>{user.email}</p>
  </div>

      {!isEditing && (
          <button 
            className="edit-btn"
            onClick={() => setIsEditing(true)}
          >
            ✏️ Edit Profile
          </button>
        )}
        {isEditing && (
        <EditProfile
          user={user}
          onSubmit={(data) => {
            // API call yahan
            handleUpdate(data)
          }}
          onCancel={() => setIsEditing(false)}
        />
        )}
    </div>

    {/* Appointment History */}
    <div className="appointment-history">
      <h2>🗓️ Appointment History</h2>

      {appointments.length === 0 ? (
        <p className="empty">No appointments yet</p>
      ) : (
        <div className="appointment-list">
          {appointments.map((a) => (
            <div key={a._id} className="user-appointment-card">
              <p><strong>Doctor:</strong> Dr. {a.doctor.firstName}</p>
              <p><strong>Specialization:</strong> {a.doctor.specialization}</p>
              <p><strong>Date:</strong> {new Date(a.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {a.slot}</p>

              <span className={`status ${a.status}`}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

}

export default UserProfile;
