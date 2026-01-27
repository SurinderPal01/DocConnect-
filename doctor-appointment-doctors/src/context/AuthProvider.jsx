import { useState, useEffect} from "react";
import AuthContext from "./AuthContext";
import api from "../utils/api";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (doctorData) => {
    console.log("LOGIN CALLED", doctorData);
    setUser(doctorData);
  };
  useEffect (()=>{
        const check = async () => {
      try {
        console.log("user check called");
        const res = await api.get("/api/auth/check");
        setUser(res.data.user);
      } catch {
        setUser(null);
      }finally {
      setLoading(false);     // <-- important
    }

    };
    check();
  } ,[]);

    const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
      setUser(null);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login , loading , setLoading ,logout}}>
      {children}
    </AuthContext.Provider>
  );
}
