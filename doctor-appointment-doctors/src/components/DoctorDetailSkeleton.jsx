import "../styles/skeleton.css";

export default function DoctorDetailSkeleton() {
  return (
    <div className="doctor-detail-skeleton">
      <div className="skeleton-back-btn"></div>
      <div className="skeleton-detail-card">
        <div className="skeleton-detail-header">
          <div className="skeleton-large-avatar"></div>
          <div className="skeleton-detail-info">
            <div className="skeleton-line xlarge"></div>
            <div className="skeleton-line large"></div>
            <div className="skeleton-details-grid">
              <div className="skeleton-detail-item"></div>
              <div className="skeleton-detail-item"></div>
              <div className="skeleton-detail-item"></div>
              <div className="skeleton-detail-item"></div>
            </div>
            <div className="skeleton-buttons">
              <div className="skeleton-btn large"></div>
              <div className="skeleton-btn large"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

