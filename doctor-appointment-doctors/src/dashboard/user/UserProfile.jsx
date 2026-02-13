import { useAuth } from "../../context/useAuth";
import { useEffect, useState } from "react";
import EditProfile from "../../components/EditProfile";
import api from "../../utils/api";
import Loader from "../../components/Loader";
import "../../styles/userprofile.css";

function UserProfile() {
  const { user, loading, setLoading, setUser } = useAuth(); // Assuming setUser updates context
  const [isEditing, setIsEditing] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      if (loading) return;
      const res = await api.get("/api/appointment/user");
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdate = async (data) => {
    try {
      setLoading(true);
      const res = await api.put("/api/users/update", {
        data: data,
      });
      // Update local user state if context supports it, otherwise reload or re-fetch
       // For now, assuming top-level context refresh or simple reload if context doesn't expose updater
       window.location.reload(); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/users/profile-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
         // Force reload to see new image or rely on Context to update if implemented
         window.location.reload();
      }
    } catch (err) {
      console.error("Photo upload failed:", err);
    }
  };

  if (loading) return <Loader />;
  if (!user) return <p>No Profile Data</p>;

  return (
    <div className="user-profile">
      <div className="profile-header-container">
        <h1>User Profile</h1>
      </div>

      <div className="profile-card">
        {/* Edit Button */}
        {!isEditing && (
          <button
            className="edit-btn-top"
            onClick={() => setIsEditing(true)}
            title="Edit Profile"
          >
            <img src="/assets/editpencil.png" alt="edit" className="dashboard-icon" />
          </button>
        )}

        {/* LEFT: Avatar & Name */}
        <div className="profile-left">
          <div className="profile-photo-container">
            <div className="profile-photo">
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt="user" />
              ) : (
                <img src="/assets/user.png" alt="default" onError={(e)=>{e.target.src="/assets/user.png"}}/>
              )}
            </div>

             {/* Upload Overlay */}
             <label htmlFor="user-photo-upload" className="photo-upload-overlay">
              <span><img src="/assets/camera.png" alt="edit" className="dashboard-icon" /></span>
            </label>
            <input
              id="user-photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}  
              className="hidden-input"
            />
          </div>

          <h2 className="profile-name">
            {user.firstName} {user.lastName}
          </h2>
          <span className="badge">Patient</span>
        </div>

        {/* RIGHT: Info or Edit Form */}
        <div className="profile-right">
          {isEditing ? (
            <div className="edit-mode-container">
                 <h3>Edit Profile</h3>
                 <EditProfile
                    user={user}
                    onSubmit={handleUpdate}
                    onCancel={() => setIsEditing(false)}
                    />
            </div>
          ) : (
            <div className="info-grid">
              <div className="info-row">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              <div className="info-row">
                <label>Age</label>
                <p>{user.age || "Not Set"}</p>
              </div>
              <div className="info-row">
                <label>Phone</label>
                <p>{user.phone || "Not Set"}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appointment History */}
      <div className="appointment-history">
         <h2> <img src="/assets/calander.png" alt="Total Appointments" className="dashboard-icon" />
         <span></span> Appointment History</h2>

        {appointments.length === 0 ? (
          <p className="empty">No appointments yet</p>
        ) : (
          <div className="appointment-list">
            {appointments.map((a) => (
              <div key={a._id} className="user-appointment-card">
                <div className="appt-header">
                     <h3>Dr. {a.doctor.firstName}</h3>
                     <span className={`status ${a.status}`}>{a.status}</span>
                </div>
                <p className="appt-spec">{a.doctor.specialization}</p>
                <div className="appt-date-time">
                    <span><img src="/assets/calander.png" alt="Total Appointments" className="appointment-history-icon" /> {new Date(a.date).toLocaleDateString()}</span>
                    <span> <img src="/assets/alarm-clock.png" alt="Upcoming" className="appointment-history-clock" />
                       {a.slot}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
