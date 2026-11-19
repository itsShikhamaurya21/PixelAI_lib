
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

const ServerUrl = import.meta.env.VITE_SERVER_URL;

function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${ServerUrl}/api/auth/me`,
          { withCredentials: true }
        );

        dispatch(setUserData(response.data.user));
      } catch (error) {
        console.error(
          "Auth check:",
          error.response?.status,
          error.response?.data || error.message
        );

        dispatch(setUserData(null));
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040f12] text-cyan-300">
        Checking authentication...
      </div>
    );
  }

  return children;
}

export default AuthInitializer;
