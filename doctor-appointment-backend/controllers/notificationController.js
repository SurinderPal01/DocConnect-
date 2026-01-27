const Notification = require("../models/Notification");

exports.getMyNotifications = async (req,res)=>{
    const page = Number(req.query.page ) || 1;
    const limit = 10;
    const skip = (page-1)*limit;

    const notifications = await Notification.find({
        recipient : req.user._id
    }).sort({createdAt:-1})
    .skip(skip)
    .limit(limit)
    res.json(notifications);
};

exports.markAsRead = async (req,res)=>{
    try{
    await Notification.findByIdAndUpdate(req.params.id,{
        isRead:true
    });
    res.json({success:"true"});
}catch(err){
    return res.status(500).json(err);
}
}

exports.unreadCount = async (req,res)=>{
    const count = await Notification.countDocuments({
        recipient:req.user._id,
        isRead:false
    });
    res.json({count});
}