import "../styles/skeleton.css";

export default function HomeSkeleton() {
  return (
    <div className="home-skeleton">
      <div className="skeleton-hero">
        <div className="skeleton-line xlarge"></div>
        <div className="skeleton-line large"></div>
        <div className="skeleton-buttons">
          <div className="skeleton-btn"></div>
          <div className="skeleton-btn"></div>
        </div>
      </div>
      
      <div className="skeleton-section">
        <div className="skeleton-line large"></div>
        <div className="skeleton-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-line medium"></div>
              <div className="skeleton-line short"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="skeleton-section">
        <div className="skeleton-line large"></div>
        <div className="skeleton-doctors-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="doctor-card-skeleton">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-line medium"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line short"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="skeleton-section">
        <div className="skeleton-line large"></div>
        <div className="skeleton-specs-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className="skeleton-spec-card"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

