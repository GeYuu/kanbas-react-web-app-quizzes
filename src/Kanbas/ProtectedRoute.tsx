import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Session from "./Account/Session";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  return (
    <Session>
      {currentUser ? children : <Navigate to="/Kanbas/Account/Signin" />}
    </Session>
  );
}