import "../styles/SkeletonBooking.css";
export default function SkeletonBooking() {
  return (
    <div className="booking-card skeleton">
      <div className="booking-info">
        <div className="sk-line title"></div>
        <div className="sk-line"></div>
        <div className="sk-line short"></div>
      </div>

      <div className="booking-actions">
        <div className="sk-btn"></div>
        <div className="sk-btn"></div>
      </div>
    </div>
  );
}
