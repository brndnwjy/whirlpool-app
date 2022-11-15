import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import io from "socket.io-client";

import Forgot from "../pages/auth/forgot";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Main from "../pages/main";
import TestPage from "../pages/testpage";

const Router = () => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!socket && token) {
      const res = io("http://localhost:4000", {
        query: {
          token: token
        }
      });
      setSocket(res);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />

        <Route path="/" element={<Main socket={socket} />} />
        <Route path="/test" element={<TestPage socket={socket} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
