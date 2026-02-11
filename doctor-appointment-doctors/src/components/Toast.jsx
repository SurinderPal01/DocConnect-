import { useEffect } from "react";
import "../styles/toast.css";

function Toast({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500); // 2.5 sec

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="toast-container">
      <div className="toast-success">
        {message}
      </div>
    </div>
  );
}

export default Toast;
