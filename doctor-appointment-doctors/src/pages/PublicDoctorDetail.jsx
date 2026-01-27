import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import Loader from "../components/Loader";
import DoctorDetailSkeleton from "../components/DoctorDetailSkeleton";
import "../styles/publicdoctordetail.css";

function PublicDoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/api/doctor/public/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error("Error fetching doctor:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDoctor();
  }, [id]);

  if (loading) return <DoctorDetailSkeleton />;
  if (!doctor) return <div className="error">Doctor not found</div>;

  return (
    <div className="public-doctor-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="doctor-detail-card">
        <div className="doctor-header-detail">
          <div className="doctor-photo-section">
            {doctor.profilePhoto ? (
              <img src={doctor.profilePhoto} alt={doctor.firstName} />
            ) : (
              <div className="doctor-avatar-detail">👨‍⚕️</div>
            )}
            {doctor.approved && (
              <span className="verified-badge-large">✓ Verified Doctor</span>
            )}
          </div>

          <div className="doctor-basic-info">
            <h1>Dr. {doctor.firstName} {doctor.lastName}</h1>
            <p className="specialization-large">{doctor.specialization}</p>
            
            <div className="doctor-details-grid">
              {doctor.experience && (
                <div className="detail-item">
                  <span className="label">Experience:</span>
                  <span className="value">{doctor.experience} years</span>
                </div>
              )}
              
              {doctor.age && (
                <div className="detail-item">
                  <span className="label">Age:</span>
                  <span className="value">{doctor.age} years</span>
                </div>
              )}

              {doctor.consultationFee && (
                <div className="detail-item">
                  <span className="label">Consultation Fee:</span>
                  <span className="value">₹{doctor.consultationFee}</span>
                </div>
              )}

              {doctor.email && (
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value">{doctor.email}</span>
                </div>
              )}

              {doctor.phone && (
                <div className="detail-item">
                  <span className="label">Phone:</span>
                  <span className="value">{doctor.phone}</span>
                </div>
              )}
            </div>

            <div className="action-buttons">
              <Link to="/login" className="btn-book">
                Login to Book Appointment
              </Link>
              <Link to="/signupuser" className="btn-signup">
                Sign Up to Book
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicDoctorDetail;

