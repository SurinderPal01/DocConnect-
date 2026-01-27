import "../styles/skelton.css";
const NotificationsSkeleton = ({ count = 6 }) => {
  return (
    <div className="notifications-page">
      <h2>Notifications</h2>

      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="notification-card skeleton-card">
          <div className="sk-dot" />
          <div className="notification-content">
            <div className="sk-line w-50" />
            <div className="sk-line w-70" />
            <div className="sk-line w-30" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsSkeleton;
