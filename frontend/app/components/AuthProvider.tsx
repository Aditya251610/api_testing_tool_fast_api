"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin } from "../../services/auth";

type User = { id?: string; username?: string } | null;

const AuthContext = createContext<{
  user: User;
  token: string | null;
  signin: (data: { username: string; password: string }) => Promise<boolean>;
  signout: () => void;
}>({ user: null, token: null, signin: async () => false, signout: () => {} });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      setToken(t);
      try {
        const payload = JSON.parse(atob(t.split(".")[1]));
        setUser({ id: payload.id, username: payload.sub });
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const signin = async (data: { username: string; password: string }) => {
    try {
      const res = await apiLogin(data);
      if (res?.access_token) {
        localStorage.setItem("token", res.access_token);
        setToken(res.access_token);
        try {
          const payload = JSON.parse(atob(res.access_token.split(".")[1]));
          setUser({ id: payload.id, username: payload.sub });
        } catch (e) {
          setUser(null);
        }
        return true;
      }
    } catch (err) {
      // propagate failure
      return false;
    }
    return false;
  };

  const signout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
