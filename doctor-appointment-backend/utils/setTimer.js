const Appointment = require("../models/Appointment");


let chatTimerInterval;

const timeToMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const normalize = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
};
const normalizeTime =(d)=>{
  return d.getHours()*60+d.getMinutes();
}

const warned = new Set();

function stopChatTimer() {
  if (chatTimerInterval) {
    clearInterval(chatTimerInterval);
    chatTimerInterval = null; // Clear interval
  }
}

function startChatTimer(io) {
  chatTimerInterval= setInterval(async () => {
    const now = new Date();
    const today = normalize(now);
    const currentMinutes = normalizeTime(now);

    // sirf aaj ke active appointments
    const appointments = await Appointment.find({
      date: {
        $gte: new Date(now.setHours(0, 0, 0, 0)),
        $lte: new Date(now.setHours(23, 59, 59, 999)),
      },
      status: { $in: ["accepted", "pending"] }
    });
    // const currentMinutes =
    //   now.getHours() * 60 + now.getMinutes();

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
      console.log("current min's and end min's",currentMinutes,endMin);
      // time over
      if (currentMinutes >= endMin) {
        io.to(app._id.toString()).emit("chat-ended");
        console.log("chat ended and status update");
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
module.exports.stopChatTimer = stopChatTimer;