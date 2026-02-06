import { useEffect,useState, useRef} from "react";
import { useParams ,useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../context/useAuth";
import api from "../utils/api";
import "../styles/chat.css";

function Chat() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const {user}  = useAuth();
  const messageEndRef = useRef(null);
  const isInitialLoad = useRef(true);

  const socketRef = useRef(null);

  const[text,setText] = useState("");
  const [warning , setWarning] = useState(null);
  const [timeOver, setTimeOver] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState(null);
  const [chatEnabled, setChatEnabled] = useState(false);

  //fetch appointment and get reciever
  useEffect(()=>{
    if(!user?._id) return;
    const fetchAppointment = async ()=>{
      try{
        const res =await api.get(`/api/appointment/${appointmentId}`);
        const app = res.data;
        const receiver = 
        user.role==="user" ?app.doctor : app.user;
        // console.log(user.role);
        setReceiverId(receiver._id);
      }catch(err){
        console.error("appointment fetch error",err);
      }
    }
    fetchAppointment();
  },[appointmentId,user?._id,user?.role]);


  useEffect(()=>{
  //chat access api 
  const checkAccess = async ()=>{
    try{
      const res = await api.get(`/api/chat/access/${appointmentId}`);
      if(res.data.expiredStatus || res.data.enabledStatus === "hidden" || res.data.enabledStatus==="disabled"){
        navigate(`/dashboard/appointment/${appointmentId}`);
      }
      setChatEnabled(res.data.enabledStatus);
    }catch(err){
      console.error("Chata access error",err);
      navigate(`/dashboard/appointment/${appointmentId}`);
    }
   };
   checkAccess();
  },[appointmentId,navigate]);

  //fetch the messages 
  useEffect(()=>{
    if(!appointmentId || !user)return;
    const fetchMessages = async ()=>{
      try{
        const res =await api.get(`/api/chat/messages/${appointmentId}`);
        setMessages(res.data);
        isInitialLoad.current = true;
      }catch(err){
        console.error(err);
      }
    }
    fetchMessages();
  },[appointmentId,user]);

  //init socket and join
  useEffect(()=>{
    if(!user?._id){
      return;
    } 

    if(!socketRef.current){
       const socketUrl =
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_SOCKET_URL  // Use live socket URL in production
      : "http://localhost:4000"; 
      socketRef.current = io(socketUrl,{
        withCredentials:true,
        transports:["websocket","polling"]
      })
      // console.log("socket",socketRef?.current);
       socketRef.current.emit("join-room", {appointmentId});
       if(chatEnabled==="enabled"){
       socketRef.current.emit("start-chat-timer",{appointmentId});
       }
       socketRef.current.on("receive-message",(msg)=>{
        setMessages((prev)=>[...prev ,msg])
       })
      // socketRef?.emit()
      // 5 minutes waring listner 
      socketRef.current.on("chat-warning",(data)=>{
        setWarning(data);
        setCountdown(data.minutesLeft *60); // seconds
      });
      //timeover listner
      socketRef.current.on("chat-ended",()=>{
        setTimeOver(true);
        setChatEnabled(false);
         // redirect after 2 sec
      setTimeout(() => {
        navigate(`/dashboard/appointment/${appointmentId}`);
      }, 2000);
      })
    }

    return ()=>{
      if(socketRef.current){
        socketRef.current.disconnect();
        socketRef.current=null;
      }
    }
  },[user?._id,socketRef,appointmentId , navigate,chatEnabled]);

  // countdown decrease
useEffect(() => {
  if (!countdown || countdown <= 0) return;

  const timer = setInterval(() => {
    setCountdown((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [countdown]);

const formatTime = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};


  //send message and emit
 const sendMessage = async () => {
  if (!chatEnabled || timeOver) return;
  if (!text.trim() || !socketRef.current) return;
  const msgData = {
    appointmentId,
    message: text.trim(),
    receiver:receiverId
  };

  try {
    socketRef.current.emit("send-message", msgData);
    await api.post("/api/chat/message", msgData);
    // setMessages((prev) => [...prev, msgData]);
    setText("");
  } catch (err) {
    console.error("Error Sending message", err);
  }
};

// to scroll to bottom 
useEffect(()=>{
  if(!messageEndRef?.current) return;

  //initial load => scroll to bottom
  if(isInitialLoad.current){
    messageEndRef.current.scrollIntoView({behaviour:"smooth"});
    isInitialLoad.current = false;
    return;
  }

  // for subsequent updates only update if user was near bottm 
  const parent = messageEndRef.current.parentElement;

  if(!parent) return;
  const distanceFromBottom =  parent.scrollHeight -(parent.scrollTop + parent.clientHeight);
  if(distanceFromBottom <150){
    // scroll to bottom
    messageEndRef.current.scrollIntoView({behaviour:"smooth"});
  }
},[messages]);

const sendFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);              // must match upload.single("file")
    formData.append("appointmentId", appointmentId);
    formData.append("receiver", receiverId);
    try{
    await api.post("/api/chat/upload", formData,{
       headers: {
      "Content-Type": "multipart/form-data",
    },
    });

    }catch(err){
      console.log("error",err);
    }
    
  } catch (err) {
    console.error("UPLOAD ERROR:", err.response?.data || err.message);
  }
};


  // Handle Enter key to send message
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

return (
    <div className="chat-page">
      <h2>Consultation Chat</h2>
      {/*  Warning Notification */}
      {warning && countdown > 0 && (
        <div className="chat-warning-box">
          ⏳ {formatTime(countdown)} remaining
        </div>
      )}

      {/* Time Over Banner */}
      {timeOver && (
        <div className="chat-ended-box">
           Consultation Time Over. Redirecting...
        </div>
      )}

      <div className="chat-messages">
        {!messages && (
          <p>No messages yet</p>
        )}
        {messages?.map((m, i) => (
          <div
            key={i}
            className={m.sender === user._id ? "msg own" : "msg"}
          >
            {/* {m.message} */}
            {m.type === "text" && <p>{m.message}</p>}

            {m.type === "image" && (
              <img src={m.message} alt="chat-img" className="chat-image" 
              onClick={() => setPreviewImg(m.message)} //open modal
              style={{ cursor: "pointer" }}/>
            )}

            {m.type === "file" && (
              <a href={m.message} target="_blank">Download file</a>
            )}
          </div>
        ))}
      <div ref={messageEndRef}></div>

      </div>

      {/* <form className="chat-input"  onSubmit={(e) => {
          e.preventDefault();
          sendMessage();   // no event here
        }}>
        <input
          type="text"
          placeholder="Type a message..."
          onKeyDown={handleKeyPress}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form> */}

      <form
  className="chat-input-bar"
  onSubmit={(e) => {
    e.preventDefault();
    sendMessage(e);
  }}
>
  {/* Hidden file input */}
  <input
    type="file"
    id="fileInput"
    style={{ display: "none" }}
    onChange={(e) => {
    // console.log("FILE SELECTED:", e.target.files[0]); // 🔥 must log file
    sendFile(e.target.files[0]);
  }}
  />

  {/* Plus / Attach button */}
  <button
    type="button"
    className="attach-btn"
    onClick={() => document.getElementById("fileInput").click()}
  >
    +
  </button>

  {/* Text input */}
  <input
    type="text"
    disabled={!chatEnabled || timeOver}
     placeholder={!chatEnabled ? "Chat disabled" : "Type a message..."}
    value={text}
    onChange={(e) => setText(e.target.value)}
    onKeyDown={handleKeyPress}
  />

  {/* Send button */}
  <button type="submit" disabled={!chatEnabled || timeOver}>Send</button>
</form>

{previewImg && (
   <div
          className="image-modal"
          onClick={() => setPreviewImg(null)} //  close on click outside
        >
          <img src={previewImg} alt="preview" className="modal-img" />
        </div>
)}

    </div>
  );
}


export default Chat;
