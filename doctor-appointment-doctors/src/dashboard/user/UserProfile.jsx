import { useAuth } from "../../context/useAuth";
import { useCallback, useEffect, useState } from "react";
import api from "../../utils/api";
import "../../styles/userprofile.css";

function UserProfile() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);


const fetchAppointments = async () => {
  try {
    const res = await api.get("/api/appointment/user");
    setAppointments(res.data);
  } catch (err) {
    console.error(err);
  }
};
 useEffect(() => {
    fetchAppointments();
}, []);


  if (!user) return <p>No Profile Data</p>;

return (
  <div className="user-profile">
    <div className="profile-header">
      <h1>User Profile</h1>
      <button className="edit-btn">✏️ Edit Profile</button>
    </div>

    <div className="profile-card">
      {/* Left Section */}
      <div className="profile-left">
        <div className="profile-photo">
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt="user" />
          ) : (
            <div className="avatar">👤</div>
          )}
        </div>

        <h2>{user.firstName} {user.lastName}</h2>
        <span className="badge">Patient</span>
      </div>

      {/* Right Section: Move info below the name */}
      <div className="profile-right">
        <div className="info-row">
          <label>Email</label>
          <p>{user.email}</p>
        </div>

        <div className="info-row">
          <label>Phone</label>
          <p>{user.phone || "—"}</p>
        </div>

        <div className="info-row">
          <label>Age</label>
          <p>{user.age || "—"}</p>
        </div>

        <div className="info-row">
          <label>Gender</label>
          <p>{user.gender || "—"}</p>
        </div>

        <div className="info-row full">
          <label>About</label>
          <p>{user.about || "No description added"}</p>
        </div>
      </div>
    </div>

    {/* Appointment History */}
    <div className="appointment-history">
      <h2>🗓️ Appointment History</h2>

      {appointments.length === 0 ? (
        <p className="empty">No appointments yet</p>
      ) : (
        <div className="appointment-list">
          {appointments.map((a) => (
            <div key={a._id} className="appointment-card">
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
