import {useState , useEffect} from "react";
// import { useNavigate } from "react-router-dom";
import NotificationsSkeleton from "../components/notificationSkelton";
import api from "../utils/api";
import "../styles/notifications.css";
function Notifications() {
    const [notifications , setNotifications] = useState([]);
    const [ loading , setLoading] = useState(true);

    useEffect(()=>{
        const getdata = async ()=>{
            try{
            const res = await api.get("/api/notifications");
            setNotifications(res.data);
        }catch(err){
            console.error(err)
        }finally{
            setLoading(false);
        }
    }
        getdata();
    },[]);
    const markRead = async(id)=>{
        try{
            await api.put(`/api/notifications/${id}`);
            setNotifications(prev =>
        prev.map(n =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
        }catch(err){
            console.error(err)
        }
    }

    if(loading) return <NotificationsSkeleton />
    if(notifications.length ===0) return <p>No notifications found</p>
  return (
   <div className="notification-page">
  <h2 className="notification-title">Notifications</h2>

  {notifications.map(n => (
    <div
      key={n._id}
      className={`notification-item ${n.isRead ? "read" : "unread"}`}
      onClick={() => markRead(n._id, n.link)}
    >
      <div className="notif-left">
        <span className="dot" />
      </div>

      <div className="notif-content">
        <h4>{n.title}</h4>
        <p>{n.message}</p>
        <span className="time">
          {new Date(n.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  ))}
</div>

  )
}

export default Notifications;
