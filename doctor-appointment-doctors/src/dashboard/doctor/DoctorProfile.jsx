import { useEffect, useState } from "react";
import api from "../../utils/api";
import Loader from "../../components/Loader";
import DoctorProfileSkeleton from "../../components/DoctorProfileSkeleton";
import UpdateDoctorProfile from "../../components/UpdateDoctorProfile";
import "../../styles/doctorprofile.css";

function DoctorProfile() {
  const [doctor, setDoctor] = useState();
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/doctor/profile");
      setDoctor(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/doctor/profile-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setDoctor({ ...doctor, profilePhoto: res.data.profilePhoto });
      }
    } catch (err) {
      console.error("Photo upload failed:", err);
    }
  };

  if (loading) return <DoctorProfileSkeleton />;
  if (!doctor) return <p>No Profile Data</p>;

  return (
    <div className="doctor-profile">
        <div className="profile-header-container">
            <h1>Doctor Profile</h1>
        </div>

      <div className="profile-card">
        {/* Top Right Edit Button */}
        {!edit && (
          <button className="edit-btn-top" onClick={() => setEdit(true)} title="Edit Profile">
             <img src="/assets/editpencil.png" alt="edit" className="dashboard-icon" />
          </button>
        )}

        {/* LEFT: Avatar, Name, Badge */}
        <div className="profile-left">
          <div className="profile-photo-container">
            <div className="profile-photo">
              {doctor.profilePhoto ? (
                <img src={doctor.profilePhoto} alt="doctor" />
              ) : (
                <img src="/assets/doctor.png" alt="default" />
              )}
            </div>

            {/* Upload Overlay */}
            <label htmlFor="photo-upload" className="photo-upload-overlay">
              <span><img src="/assets/camera.png" alt="edit" className="dashboard-icon" /></span>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden-input"
            />
          </div>

          <h2>
            Dr. {doctor.firstName} {doctor.lastName}
          </h2>
          <span className="doctor-badge">{doctor.specialization}</span>
        </div>

        {/* RIGHT: Details OR Edit Form */}
        <div className="profile-right">
          {edit ? (
            <div className="edit-mode-container">
                <h3>Edit Profile</h3>
                <UpdateDoctorProfile
                doctor={doctor}
                onCancel={() => setEdit(false)}
                onUpdate={() => {
                    setEdit(false);
                    fetchProfile();
                }}
                />
            </div>
          ) : (
            <div className="info-grid">
              <div className="info-row">
                <label>Experience</label>
                <p>{doctor.experience || 0} years</p>
              </div>

              <div className="info-row">
                <label>Email</label>
                <p>{doctor.email}</p>
              </div>

              <div className="info-row">
                <label>Phone</label>
                <p>{doctor.phone}</p>
              </div>

              {doctor.consultationFee !== 0 && (
                <div className="info-row">
                  <label>Consultation Fee</label>
                  <p>₹ {doctor.consultationFee}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;