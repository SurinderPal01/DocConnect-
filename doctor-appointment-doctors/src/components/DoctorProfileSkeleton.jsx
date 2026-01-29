import "../styles/skeleton.css";

function DoctorProfileSkeleton() {
  return (
    <div className="doctor-profile">
      <div className="profile-header">
        <div className="skeleton-line xlarge" style={{ width: "40%" }} />
        <div className="skeleton-btn" style={{ width: 140 }} />
      </div>

      <div className="profile-card">
        <div className="profile-left">
          <div className="profile-photo">
            <div className="skeleton-large-avatar" />
          </div>
          <div className="skeleton-line large" style={{ width: "70%", margin: "0 auto" }} />
          <div className="skeleton-line short" style={{ width: "50%", margin: "0.5rem auto 0" }} />
        </div>

        <div className="profile-right">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="info-row">
              <div className="skeleton-line short" style={{ width: "40%" }} />
              <div className="skeleton-line medium" />
            </div>
          ))}
          <div className="info-row full">
            <div className="skeleton-line short" style={{ width: "30%" }} />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfileSkeleton;



