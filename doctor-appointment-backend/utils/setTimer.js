const Appointment = require("../models/Appointment");

const appointmentTimers = new Map(); // appointmentId -> interval
const warned = new Set(); // appointmentId -> warnedOnce

// Timer based purely on stored Date fields (start/end) so it works
// correctly across timezones. Appointment.start and .end are absolute
// Date values; the server compares them to current time in the same scale.
function startAppointmentTimer(io, appointmentId) {
  if (appointmentTimers.has(appointmentId)) return;

  const interval = setInterval(async () => {
    const app = await Appointment.findById(appointmentId);

    // invalid / already closed
    if (!app || !["accepted", "pending"].includes(app.status)) {
      stopAppointmentTimer(appointmentId);
      return;
    }

    const now = Date.now();
    const start = new Date(app.start).getTime();
    const end = new Date(app.end).getTime();

    // appointment abhi start nahi hua
    if (now < start) return;

    const diff = Math.floor((end - now) / 60000);

    // 5 min warning (once)
    if (diff <= 5 && diff > 0 && !warned.has(appointmentId)) {
      io.to(appointmentId).emit("chat-warning", {
        minutesLeft: diff,
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
