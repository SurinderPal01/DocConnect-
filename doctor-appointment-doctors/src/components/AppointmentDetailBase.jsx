import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import AppointmentDetailSkeleton from "../components/AppointmentDetailSkeleton";
import api from "../utils/api";
import Loader from "../components/Loader";
import { formatTime } from "../utils/time";
import "../styles/appointmentdetailbase.css";

function AppointmentDetailBase({ role, actions }) {
  const [appointment, setAppointment] = useState(null);
  const { id } = useParams();
  const [chatStatus, setChatStatus] = useState(null);
  const [expired, setChatExpired] = useState(false);
  const [loading, setLoading] = useState(true);
  const history = appointment?.statusHistory ?? [];
  const navigate = useNavigate();

  // let shouldShowChatButton = false;
  const [shouldShowChatButton, setShouldShowChatButton] = useState(false);
  const [showPaymentButton, setShowPaymentButton] = useState(false);
  // appointment?.status === "accepted" &&
  // // chatStatus !== "expired" &&
  // !expired &&
  // chatStatus !== "hidden";
  // // const isChatDisabled = chatStatus !== "expired";

  // const lastIndex = history.length - 1;
  const statusIcon = {
    pending: "⏳",
    accepted: "✅",
    rejected: "❌",
    cancelled: "❌",
  };

  const paymentLabel = {
  NOT_ALLOWED: "Not Available",
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  }

  const getData = useCallback(async () => {
    try {
      const res = await api.get(`/api/appointment/${id}`);
      console.log("app",res.data);
      setAppointment(res.data);
      // if(res.data.paymentStatus ==="PENDING"){setShowPaymentButton(true)}
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    getData();
  }, [getData]);

  // to get chat enabled status
  const getChatStatus = useCallback(async () => {
    if (!appointment?._id) return;

    try {
      const res = await api.get(`/api/chat/access/${appointment._id}`);
      setChatStatus(res.data.enabledStatus);
      setChatExpired(res.data.expiredStatus);

    } catch (err) {
      console.error(err);
    }
  }, [appointment?._id]);

  useEffect(() => {
    if (appointment?._id) {
      getChatStatus();
    }
  }, [appointment?._id, getChatStatus]);

  useEffect(()=>{
    if(appointment?.paymentStatus=="PAID" &&
      chatStatus ==="enabled" && !expired
    ){
      setShouldShowChatButton(true);
    }else{
      setShouldShowChatButton(false);
    }
  },[appointment?.paymentStatus,chatStatus,expired])

  useEffect(() => {
    if (
      role === "user" &&
      appointment?.status === "accepted" &&
      appointment?.paymentStatus === "PENDING"
    ) {
      setShowPaymentButton(true);
    } else {
      setShowPaymentButton(false);
    }
  }, [appointment, role]);

  const onUpdate = () => {
    getData();
  };

  const handlePayment = async () =>{
    try{
       const res = await api.post("/api/payment/create-order", {
      appointmentId: appointment._id,
    });

    const order = res.data;

    // 2. Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: "Doctor Appointment",
      description: "Consultation Fee",
      order_id: order.id,

      handler: async function (response) {
        // 3. Verify payment
        await api.post("/api/payment/verify", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          appointmentId: appointment._id,
        });

        // 4. Refresh data
        getData();
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", async () => {
      console.log("payment failed");
      await api.post("/api/appointment/mark-failed", {
        appointmentId: appointment._id,
      });
      getData();
    }); 

    rzp.open();

    }catch(err){
      console.log(err);
      alert("Payment Failed");
    }
  }
  if (loading) {
    return <AppointmentDetailSkeleton />;
  }
  if (!appointment) return <p>No appointments found</p>;

  return (
    <div className="appointment-detail-card">
      <h2>Appointment Details</h2>

      <div className="detail-row">
        <span>Status:</span>
        <strong className={`status ${appointment.status}`}>
          {appointment.status}
        </strong>
      </div>

      <div className="detail-row">
        <span>Date:</span>
        <strong>
          {new Date(appointment.date).toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </strong>
      </div>

      <div className="detail-row">
        <span>Time:</span>
        <strong>
          {formatTime(appointment.start)} - {formatTime(appointment.end)}
        </strong>
      </div>

      {/* USER VIEW */}
      {role === "user" && appointment.doctor && (
        <>
          <hr />
          <h4>Doctor</h4>
          <p>
            Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
          </p>
          {appointment.doctor.phone && <p>📞 {appointment.doctor.phone}</p>}
        </>
      )}

      {/* DOCTOR VIEW */}
      {role === "doctor" && appointment.user && (
        <>
          <hr />
          <h4>Patient</h4>
          <p>
            {appointment.user.firstName} {appointment.user.lastName}
          </p>
        </>
      )}

      <strong className={`payment ${appointment.paymentStatus}`}>
        Payment:{paymentLabel[appointment.paymentStatus]}
      </strong>

      {/* ACTIONS */}
      <div className="actions-area">
        {actions && actions(appointment, onUpdate)}
      </div>

      <div className="timeline">
        {history.map((s, i) => (
          <div
            key={s._id}
            className={`timeline-item ${i === history.length - 1 ? "active" : ""}`}
          >
            <span className="dot" />
            <div className="content">
              <div className="title">
                {statusIcon[s.status]} {s.status}
              </div>
              <small>{new Date(s.at).toLocaleString("en-IN")}</small>
            </div>
          </div>
        ))}
      </div>
      {shouldShowChatButton && (
        <div className="chat-action">
          <button
            className={`chat-btn ${expired ? "disabled" : "enabled"}`}
            disabled={expired}
            onClick={() => navigate(`/chat/${id}`)}
          >
            {chatStatus === "enabled" ? "Join Chat" : "Chat Available Soon"}
          </button>
        </div>
      )}

      {showPaymentButton && role === "user" && (
        <div>
          <button className="pay-btn" onClick={handlePayment}>Pay</button>
        </div>
      )}
    </div>
  );
}

export default AppointmentDetailBase;
