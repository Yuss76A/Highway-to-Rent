import React, { createContext, useState, useEffect } from "react";
import api from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username, password) => {
    try {
      const response = await api.post("https://carbookingbackend-df57468af270.herokuapp.com/carbooking/auth/login/", {
        username,
        password,
      });
      
      const userData = response.data.user;
      const token = response.data.token;

      setUser({
        id: userData.id,
        name: userData.name,
        token,
      });
      
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        name: userData.name,
        token,
      }));

      
      return response.data;
    } catch (error) {
      
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};