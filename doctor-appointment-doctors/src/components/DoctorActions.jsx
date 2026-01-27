import api from "../utils/api";

function DoctorActions({ appointment, onUpdate }) {
  const { _id, status } = appointment;

  // ❌ accepted ke baad kuch nahi
  if (status !== "pending") return null;

  const handleAction = async (action) => {
    await api.put(`/api/appointment/${_id}/${action}`);
    onUpdate();
  };

  return (
    <div className="actions-area">
      <button className="accept-btn" onClick={() => handleAction("accept")}>
        Accept
      </button>
      <button className="reject-btn" onClick={() => handleAction("reject")}>
        Reject
      </button>
    </div>
  );
}


export default DoctorActions;
