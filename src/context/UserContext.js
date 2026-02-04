import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // user = { id, username, email } 정도만

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user,setUser ,login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// 편하게 쓰기 위한 hook
export const useUser = () => useContext(UserContext);
