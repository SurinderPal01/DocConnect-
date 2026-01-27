const express = require("express")
const Chat = require("../models/Chat");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const router = express.Router();

const {
    getChatAccess,
    sendMessage,
    getMessages,
    uploadChatFile
} = require("../controllers/chatController");


// router.get("/:id",auth,getChat);
// router.post("/:id",auth,sendChat);
router.get("/access/:id",auth,getChatAccess);
router.get("/messages/:id",auth,getMessages);
router.post("/message",auth,sendMessage);
// router.post("/upload",auth,upload.single("file"),uploadChatFile);
// router.post("/upload", auth, (req, res, next) => {
//     upload.single("file")(req, res, function (err) {
//       if (err) {
//         return res.status(400).json({ error: err.message });
//       }
//       next();
//     });
//   }, uploadChatFile);
router.post("/upload", auth, (req, res, next) => {
  next();
}, upload.single("file"), uploadChatFile);


module.exports = router;