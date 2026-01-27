const Appointment = require("../models/Appointment");

const timeToMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const normalize = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
};

const warned = new Set();

function startChatTimer(io) {
    console.log("start timer called");
  setInterval(async () => {
    const now = new Date();
    const today = normalize(now);

    // sirf aaj ke active appointments
    const appointments = await Appointment.find({
      date: {
        $gte: new Date(now.setHours(0, 0, 0, 0)),
        $lte: new Date(now.setHours(23, 59, 59, 999)),
      },
      status: { $in: ["accepted", "pending"] }
    });

    const currentMinutes =
      now.getHours() * 60 + now.getMinutes();

    for (let app of appointments) {
      const startMin = timeToMinutes(app.start);
      const endMin = timeToMinutes(app.end);

      //  5 minute warning
      const diff = endMin - currentMinutes;

      if (diff <= 5 && diff > 0 && !warned.has(app._id.toString())) {
        io.to(app._id.toString()).emit("chat-warning", {
          minutesLeft: diff
        });

        warned.add(app._id.toString());
      }

      // time over
      if (currentMinutes >= endMin) {
        io.to(app._id.toString()).emit("chat-ended");

        if (app.status !== "completed") {
          app.status = "completed";
          app.statusHistory.push({ status: "completed" });
          await app.save();
        }
      }
    }
  }, 30000); // har 30 sec
}

module.exports = startChatTimer;
