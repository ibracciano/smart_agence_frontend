// import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="ml-[20%] w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
