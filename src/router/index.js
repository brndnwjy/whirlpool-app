import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "../pages/auth/login";

const ScrollToTop = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return children;
};

const Router = () => {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </ScrollToTop>
    </BrowserRouter>
  );
};

export default Router;
