const Appointment = require("../models/Appointment");


let chatTimerInterval;
const warned = new Set();

const IST_OFFSET_MINUTES = 330;

// IST "HH:mm" + date + UTC minutes
const getUTCMinutesFromIST = (date,time)=>{
  const [h,m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h,m,0,0);
  return Math.floor((d.getTime()-IST_OFFSET_MINUTES*60000)/60000);
}



function stopChatTimer() {
  if (chatTimerInterval) {
    clearInterval(chatTimerInterval);
    chatTimerInterval = null; // Clear interval
  }
}

function startChatTimer(io) {
  chatTimerInterval = setInterval(async () => {
    const nowUTC = new Date();
    const nowMinutesUTC = Math.floor(nowUTC.getTime() / 60000);

    // aaj ke appointments (date match safe)
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ["accepted", "pending"] }
    });

    for (let app of appointments) {
      const startMinUTC = getUTCMinutesFromIST(app.date, app.start);
      const endMinUTC = getUTCMinutesFromIST(app.date, app.end);

      const diff = endMinUTC - nowMinutesUTC;

      //  5 min warning
      console.log("difference is",diff);
      if (diff <= 5 && diff > 0 && !warned.has(app._id.toString())) {
        io.to(app._id.toString()).emit("chat-warning", {
          minutesLeft: diff
        });
        warned.add(app._id.toString());
      }

      console.log(
        "NOW UTC:", nowMinutesUTC,
        "END UTC:", endMinUTC
      );

      //  chat end
      if (nowMinutesUTC >= endMinUTC) {
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
module.exports.stopChatTimer = stopChatTimer;