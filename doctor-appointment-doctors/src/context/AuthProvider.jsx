import { useState, useEffect} from "react";
import AuthContext from "./AuthContext";
import api from "../utils/api";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const AUTH_INTENT_KEY = "hasLoggedIn";

  const login = (userdata) => {
    sessionStorage.setItem(AUTH_INTENT_KEY, "true");
    setUser(userdata);
  };
  useEffect (()=>{
     const hasIntent = sessionStorage.getItem("hasLoggedIn");
    // console.log("hasIntent value",hasIntent);
     if (!hasIntent) {
    setLoading(false);
    return;
  }
        const check = async () => {
    // console.log("check called");
      try {
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
      sessionStorage.removeItem("hasLoggedIn");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
      setUser(null);
      sessionStorage.removeItem("hasLoggedIn");
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login , loading , setLoading ,logout}}>
      {children}
    </AuthContext.Provider>
  );
}
