import { useState, createContext, useEffect } from "react";
import { me } from "../data/fetch";

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState();
  const getME = async () => {
    try {
      const meInfo = await me();
      setUserInfo(meInfo);
    } catch (error) {
      if (error.message === "401") {
        localStorage.removeItem("token");
        setToken(null);
      }
    }
  };
  useEffect(() => {
    if (token) getME()
  }
  , [token]);
  const value = { token, setToken, userInfo, setUserInfo };
  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  )
}
