import { useState } from "react";
import api from "../utils/api";

function UserActions({ appointment, onUpdate }) {
  const { _id, status } = appointment;
  const [showModal , setShowModal] = useState(false);
  const [reason , setReason] = useState("")
  if (!["pending", "accepted"].includes(status)) return null;

  const handleCancel = async () => {
    try {
        if (!reason.trim()) {
        alert("Please provide reason");
        return;
      }
      await api.put(`/api/appointment/${_id}/cancel`,{
        reason:reason
      });
      setShowModal(false);
      onUpdate();
    } catch(err){
      console.error(err);
      alert("Cancel failed");
    }
  };

  return (
    <div className="actions-area">
      {/* <button className="cancel-btn" onClick={handleCancel}>
        Cancel Appointment
      </button> */}
      <button className="cancel-btn" onClick={()=>setShowModal(true)}>
        Cancel Appointment
      </button>
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
          <h3>Cacncel Appointment</h3>
          <textarea
          value={reason}
          onChange={(e)=>setReason(e.target.value)}
          required={true}
          placeholder="Enter reason"></textarea>
          <div className="modal-actions">
            <button onClick={()=>setShowModal(false)}>back</button>
            <button onClick={handleCancel}>Confirm</button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserActions;
