const Notification = require("../models/Notification");

exports.createNotification = async ({
    recipient,
  recipientModel,
  appointment,
  title,
  doctor,
  message,
  link

})=>{
    await Notification.create({
         recipient,
        recipientModel,
        appointment,
        doctor,
        title,
        message,
        link
    })
}