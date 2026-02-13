import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import Loader from "../components/Loader";
import DoctorDetailSkeleton from "../components/DoctorDetailSkeleton";
import { useAuth } from "../context/useAuth";
import DoctorSlots from "../dashboard/user/DoctorSlots";
import "../styles/publicdoctordetail.css";

function PublicDoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

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

  // available dates logic (safe check)
  const availableDates = doctor.availability ? doctor.availability.map(a =>
    new Date(a.date).toISOString().split("T")[0]
  ) : [];

  return (
    <div className="public-doctor-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="doctor-detail-container">
        {/* 1. PROFILE CARD */}
        <div className="doctor-profile-card">
          <div className="doctor-profile-image">
             <img 
                src={doctor.profilePhoto || "/assets/doctor.png"} 
                alt={`Dr. ${doctor.firstName}`} 
                onError={(e) => {e.target.onerror = null; e.target.src = "/assets/doctor.png"}}
              />
          </div>
          
          <div className="doctor-profile-info">
            <div className="profile-header">
               <h2>Dr. {doctor.firstName} {doctor.lastName}</h2>
               <span className="profile-spec">{doctor.specialization}</span>
               {doctor.approved && <span className="verified-badge">✔ Verified</span>}
            </div>

            <div className="profile-meta-grid">
               <div className="meta-item">
                  <span className="meta-label">Experience</span>
                  <span className="meta-value">{doctor.experience ? `${doctor.experience} Years` : '5+ Years'}</span>
               </div>
               <div className="meta-item">
                  <span className="meta-label">Languages</span>
                  <span className="meta-value">English, Hindi</span>
               </div>
               <div className="meta-item">
                  <span className="meta-label">Consultation</span>
                  <span className="meta-value">₹{doctor.consultationFee || '500'}</span>
               </div>
               <div className="meta-item">
                  <span className="meta-label">Contact</span>
                  <span className="meta-value">{doctor.phone || 'N/A'}</span>
               </div>
            </div>
            
            <div className="about-doctor">
               <h3>About Doctor</h3>
               <p>Dr. {doctor.firstName} is a highly skilled {doctor.specialization}. Dedicated to providing the best patient care.</p>
            </div>
          </div>
        </div>

        {/* 2. BOOKING SECTION */}
        <div className="booking-section">
          <div className="booking-header">
             <h3>Book an Appointment</h3>
             <p>{user ? "Select a date to view available time slots" : "Please login to book an appointment"}</p>
          </div>

          {user ? (
            <>
              <div className="date-selector-container">
                  <label htmlFor="date-input">Select Date:</label>
                  <input
                    id="date-input"
                    type="date"
                    className="styled-date-input"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                  />
              </div>

              {selectedDate ? (
                  <DoctorSlots
                  doctor={doctor}
                  selectedDate={selectedDate}
                  />
              ) : (
                  <div className="empty-slots-state">
                      <p>Please select a date from the calendar above to proceed.</p>
                  </div>
              )}
            </>
          ) : (
            <div className="guest-booking-action">
              <Link to="/login" className="btn-book">
                Login to Book Appointment
              </Link>
              <Link to="/signupuser" className="btn-signup">
                Sign Up to Book
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicDoctorDetail;

