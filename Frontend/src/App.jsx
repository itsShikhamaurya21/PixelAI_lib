
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import Home from "./Pages/Home.jsx";
import Generate from "./Pages/Generate.jsx";

import {
  setAllComponents,
  setAllUsers,
  setUserData,
} from "./redux/userSlice.js";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import AllComponents from "./Pages/AllComponents.jsx";
import MyComponents from "./Pages/MyComponents.jsx";
import Pricing from "./Pages/Pricing.jsx";

const ServerUrl = import.meta.env.VITE_SERVER_URL;

function App() {
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);

  const [authChecked, setAuthChecked] = useState(false);

  // ==========================================
  // FETCH CURRENT LOGGED-IN USER
  // ==========================================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${ServerUrl}/api/user/current-user`,
          {
            withCredentials: true,
          }
        );

        console.log("Current user:", res.data);

        dispatch(setUserData(res.data));
      } catch (error) {
        console.error("Fetch user error:", error);
        console.error("Backend response:", error.response?.data);

        dispatch(setUserData(null));
      } finally {
        setAuthChecked(true);
      }
    };

    fetchUser();
  }, [dispatch]);

  // ==========================================
  // FETCH ALL USERS AND COMPONENTS
  // ==========================================

  useEffect(() => {
    if (!userData) {
      dispatch(setAllUsers(null));
      dispatch(setAllComponents(null));
      return;
    }

    const fetchAllUsers = async () => {
      try {
        const usersRes = await axios.get(
          `${ServerUrl}/api/user/all-users`,
          {
            withCredentials: true,
          }
        );

        console.log("All users:", usersRes.data);

        dispatch(setAllUsers(usersRes.data));
      } catch (error) {
        console.error("Fetch all users error:", error);
        console.error("Backend response:", error.response?.data);

        dispatch(setAllUsers(null));
      }
    };

    const fetchAllComponents = async () => {
      try {
        const componentRes = await axios.get(
          `${ServerUrl}/api/components/all-components`,
          {
            withCredentials: true,
          }
        );

        console.log("All components:", componentRes.data);

        dispatch(setAllComponents(componentRes.data));
      } catch (error) {
        console.error("Fetch all components error:", error);
        console.error("Backend response:", error.response?.data);

        dispatch(setAllComponents(null));
      }
    };

    fetchAllUsers();
    fetchAllComponents();
  }, [userData, dispatch]);

  // ==========================================
  // APP UI
  // ==========================================

  return (
    <>
      {!authChecked && (
        <div className="fixed top-0 left-0 z-50 h-1 w-full animate-pulse bg-[#35ebff]" />
      )}

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/admin" element={<AdminDashboard></AdminDashboard>} />
        <Route path="/components" element={<AllComponents></AllComponents>} />
        <Route path="/my-components" element={<MyComponents></MyComponents>} />
        <Route path="/pricing" element={<Pricing></Pricing>} />
        
      </Routes>
    </>
  );
}

export default App;
