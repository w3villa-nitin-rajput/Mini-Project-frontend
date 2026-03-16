import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import ProfilePictureUpload from "../components/Profile/ProfilePictureUpload";
import LocationAutocomplete from "../components/Profile/LocationAutocomplete";
import MapDisplay from "../components/Profile/MapDisplay";

const Profile = () => {
    const { userData, loadUserProfileData, updateProfile, downloadProfile, profileLoading } = useAppContext();

    const [formData, setFormData] = useState({
        cloudinary_url: "",
        cloudinary_public_id: "",
        address: "",
        latitude: null,
        longitude: null,
    });

    // Sync form when context userData changes (initial load or after update)
    useEffect(() => {
        if (userData) {
            setFormData({
                cloudinary_url: userData.cloudinary_url || "",
                cloudinary_public_id: userData.cloudinary_public_id || "",
                address: userData.address || "",
                latitude: userData.latitude || null,
                longitude: userData.longitude || null,
            });
        }
    }, [userData]);

    const handleImageUpload = (url, public_id) => {
        setFormData((prev) => ({
            ...prev,
            cloudinary_url: url,
            cloudinary_public_id: public_id,
        }));
    };

    const handleAddressChange = (address) => {
        setFormData((prev) => ({ ...prev, address }));
    };

    const handleLocationChange = (coords) => {
        setFormData((prev) => ({
            ...prev,
            latitude: coords.lat,
            longitude: coords.lng,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDownload = async () => {
        try {
            await downloadProfile();
        } catch (error) {
            console.error(error);
        }
    };

    if (profileLoading && !userData) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r bg-primary px-6 py-8 sm:px-10">
                    <h1 className="text-3xl font-extrabold text-white text-center sm:text-left">
                        Your Profile
                    </h1>
                    <p className="mt-2 text-blue-100 text-center sm:text-left">
                        Manage your account settings, profile picture and address.
                    </p>
                </div>

                <div className="px-6 py-8 sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Profile Picture Section */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 border-b border-gray-200 pb-8">
                            <div className="flex-shrink-0">
                                <ProfilePictureUpload
                                    currentImage={formData.cloudinary_url}
                                    onImageUpload={handleImageUpload}
                                    isUploadingGlobal={profileLoading}
                                />
                            </div>
                            <div className="flex-1 space-y-4 w-full">
                                <div>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Picture</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        This image will be shown on your profile and in reviews. High resolution pictures up to 5MB are supported.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 mt-4">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Display Name</label>
                                        <input
                                            type="text"
                                            disabled
                                            value={userData?.name || ""}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 cursor-not-allowed text-gray-500"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                        <input
                                            type="text"
                                            disabled
                                            value={userData?.email || ""}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 cursor-not-allowed text-gray-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="pt-2">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Location Settings</h3>
                                <p className="mt-1 text-sm text-gray-500 mb-6">
                                    Update your primary address. This helps us personalize your shopping experience.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-y-6">
                                <div>
                                    <LocationAutocomplete
                                        address={formData.address}
                                        setAddress={handleAddressChange}
                                        setLocationCoordinates={handleLocationChange}
                                    />
                                </div>

                                <MapDisplay
                                    coordinates={{ lat: formData.latitude, lng: formData.longitude }}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-gray-200 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={profileLoading}
                                className="inline-flex justify-center py-2.5 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                            >
                                Download Profile
                            </button>
                            <button
                                type="submit"
                                disabled={profileLoading}
                                className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                            >
                                {profileLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
