const Appointment = require("../models/Appointment");

const appointmentTimers = new Map(); // appointmentId -> interval
const warned = new Set(); // appointmentId -> warnedOnce

const IST_OFFSET_MINUTES = 330;

// date + "HH:mm" (IST) -> UTC minutes
function toUTCMinutes(date, time) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0); // treat as IST time
  return Math.floor((d.getTime() - IST_OFFSET_MINUTES * 60000) / 60000);
}

function startAppointmentTimer(io, appointmentId) {
  if (appointmentTimers.has(appointmentId)) return;

  const interval = setInterval(async () => {
    const app = await Appointment.findById(appointmentId);

    // invalid / already closed
    if (!app || !["accepted", "pending"].includes(app.status)) {
      stopAppointmentTimer(appointmentId);
      return;
    }

    const nowUTCMin = Math.floor(Date.now() / 60000);

    const startUTCMin = toUTCMinutes(app.date, app.start);
    const endUTCMin   = toUTCMinutes(app.date, app.end);

    // appointment abhi start nahi hua
    if (nowUTCMin < startUTCMin) return;

    const diff = endUTCMin - nowUTCMin;

    // 5 min warning (once)
    if (diff <= 5 && diff > 0 && !warned.has(appointmentId)) {
      io.to(appointmentId).emit("chat-warning", {
        minutesLeft: diff
      });
      warned.add(appointmentId);
    }

    // appointment over
    if (diff <= 0) {
      io.to(appointmentId).emit("chat-ended");

      app.status = "completed";
      app.statusHistory.push({ status: "completed" });
      await app.save();

      stopAppointmentTimer(appointmentId);
    }
  }, 30000);

  appointmentTimers.set(appointmentId, interval);
}

function stopAppointmentTimer(appointmentId) {
  const timer = appointmentTimers.get(appointmentId);
  if (!timer) return;

  clearInterval(timer);
  appointmentTimers.delete(appointmentId);
  warned.delete(appointmentId);
}

module.exports = {
  startAppointmentTimer,
  stopAppointmentTimer,
};
