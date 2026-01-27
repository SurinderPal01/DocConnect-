import "../styles/skeleton.css";

export default function DoctorCardSkeleton() {
  return (
    <div className="doctor-card-skeleton">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-content">
        <div className="skeleton-line title"></div>
        <div className="skeleton-line medium"></div>
        <div className="skeleton-line short"></div>
        <div className="skeleton-line short"></div>
      </div>
    </div>
  );
}

