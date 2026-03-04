import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { userService, profileService } from "../api/api";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(localStorage.getItem('token') || "");
  // Instead of useState(false), check if a token exists right away
  const [user, setUser] = useState(!!localStorage.getItem('token'));
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadUserProfileData = useCallback(async () => {
    setProfileLoading(true);
    try {
      const response = await userService.getProfile();
      setUserData(response.data);
      return response.data;
    } catch (error) {
      console.error("Profile load failed:", error);
      setUserData(null);
      setToken("");
      localStorage.removeItem("token");
    } finally {
      setProfileLoading(false);
    }
  }, [setToken]);

  const updateProfile = useCallback(async (data) => {
    setProfileLoading(true);
    try {
      const response = await profileService.updateProfile(data);
      setUserData(response.data);
      toast.success("Profile updated successfully");
      return response.data;
    } catch (err) {
      toast.error(err || "Failed to update profile");
      throw err;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(null);
    }
  }, [token, loadUserProfileData]);

  const value = {
    token, setToken,
    user, setUser,
    showUserLogin, setShowUserLogin,
    backendUrl,
    userData, setUserData,
    loadUserProfileData, updateProfile,
    profileLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);