import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import api from "../../utils/api";
import DoctorSlots from "./DoctorSlots";
import "../../styles/doctordetail.css";

function DoctorDetails() {
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const { doctorId } = useParams();

  useEffect(() => {
    api.get(`/api/doctor/${doctorId}`).then(res => {
      console.log("data",res.data.availability);
      setDoctor(res.data);
    });
  }, [doctorId]);

  if (!doctor) return <Loader />;

  // available dates from doctor availability
  const availableDates = doctor.availability.map(a =>
    new Date(a.date).toISOString().split("T")[0]
  );
  if(!availableDates) return <p>No slots available for this date</p>

  return (
    <div className="doctor-detail-page">
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
                <span className="meta-value">12+ Years</span>
             </div>
             <div className="meta-item">
                <span className="meta-label">Languages</span>
                <span className="meta-value">English, Hindi</span>
             </div>
             <div className="meta-item">
                <span className="meta-label">Patients</span>
                <span className="meta-value">500+</span>
             </div>
             <div className="meta-item">
                <span className="meta-label">Contact</span>
                <span className="meta-value">{doctor.phone}</span>
             </div>
          </div>
          
          <div className="about-doctor">
             <h3>About Doctor</h3>
             <p>Dr. {doctor.firstName} is a highly skilled {doctor.specialization} with over 12 years of experience in treating complex cases. Dedicated to providing the best patient care.</p>
          </div>
        </div>
      </div>

      {/* 2. BOOKING SECTION */}
      <div className="booking-section">
        <div className="booking-header">
           <h3>Book an Appointment</h3>
           <p>Select a date to view available time slots</p>
        </div>

        <div className="date-selector-container">
            <label htmlFor="date-input">Select Date:</label>
            <input
              id="date-input"
              type="date"
              className="styled-date-input"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              // min={availableDates[0]}
              // max={availableDates[availableDates.length - 1]}
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
      </div>
    </div>
  );
}

export default DoctorDetails;
