import React from "react";
import { useSelector } from "react-redux";

function Dashboard() {
  const fullName = useSelector((state) => state.login.fullname);
  return <div>Fresh morning {fullName || "user"}!</div>;
}

export default Dashboard;
