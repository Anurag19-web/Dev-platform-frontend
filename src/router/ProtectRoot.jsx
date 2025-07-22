import { Navigate } from "react-router-dom";

export const ProtectedRoot = ({children})=>{
  const userId = JSON.parse(localStorage.getItem("userId"));

  if (!userId) {
    // If not logged in, redirect to login
    return <Navigate to="/signup" replace />;
  }

  return children;
}