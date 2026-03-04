import { useState, useCallback } from "react";
import { userService, profileService } from "../api/api";
import { toast } from "react-toastify";

export const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await userService.getProfile();
            setProfile(response.data);
            return response.data;
        } catch (err) {
            setError(err);
            toast.error(err.message || "Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProfile = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await profileService.updateProfile(data);
            setProfile(response.data);
            toast.success("Profile updated successfully");
            return response.data;
        } catch (err) {
            setError(err);
            toast.error(err.message || "Failed to update profile");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { profile, setProfile, loading, error, fetchProfile, updateProfile };
};
