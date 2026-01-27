import "../styles/skelton.css";
const AppointmentDetailSkeleton = () => {
  return (
    <div className="appointment-detail-card skeleton-card">
      <h2>Appointment Details</h2>

      <div className="sk-line w-40" />
      <div className="sk-line w-60" />
      <div className="sk-line w-50" />

      <div className="sk-divider" />

      <div className="sk-line w-30" />
      <div className="sk-line w-40" />

      <div className="sk-timeline">
        {[1, 2, 3].map(i => (
          <div key={i} className="sk-timeline-row">
            <div className="sk-dot" />
            <div className="sk-line w-60" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentDetailSkeleton;
