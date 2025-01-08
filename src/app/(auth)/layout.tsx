'use client'

import React, { useEffect } from "react";
import adminApi from "@/utils/http/admin-api";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if(jwt) {
      adminApi.defaults.headers['Authorization'] = `Bearer ${jwt}`;
      window.location.href = '/dashboard';
    }
  }, []);
  
  return (
    <div style={layoutStyles.container}>
      <div style={layoutStyles.card}>
        {children}
      </div>
    </div>
  );
};

const layoutStyles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "var(--color-background-primary)",
  },
  card: {
    backgroundColor: "var(--color-background-secondary)",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  },
};

export default AuthLayout;
