import React from 'react'
import "../styles/doctoravailabilityskelton.css";

function DoctorAvailabilitySkelton() {
  return (
       <div className="day-card skeleton-card">
      <div className="skeleton skeleton-title"></div>

      {[...Array(8)].map((_, i) => (
  <div key={i} className="slot-row">
    <div className="skeleton skeleton-time"></div>
    <div className="skeleton skeleton-btn"></div>
  </div>
))}

    </div>
  )
}

export default DoctorAvailabilitySkelton