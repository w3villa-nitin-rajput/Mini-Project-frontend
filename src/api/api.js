import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const apiClient = axios.create({
    baseURL: backendUrl,
});

// REQUEST INTERCEPTOR (Adding Token)
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        // Standard way: Authorization: Bearer <token>
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// RESPONSE INTERCEPTOR (Handling Errors Globally)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        let message = "An unexpected error occurred";

        if (error.response && error.response.data) {
            const data = error.response.data;
            console.log("Backend Error Data:", data); 

            if (data.errors && Array.isArray(data.errors)) {
                message = data.errors.join(", ");
            } 
            else if (data.error) {
                message = data.error;
            }
            else if (data.message) {
                message = data.message;
            }
        }

        return Promise.reject(message);
    }
);

export const userService = {
    login: (data) => apiClient.post("/login", data),
    register: (data) => apiClient.post("/signup", data),
    verifyEmail: (token) => apiClient.get(`/verify-email?token=${token}`),
    resendVerificationEmail: () => apiClient.get('/resend-verification-email'),
    getProfile: () => apiClient.get('/get-profile')
};

export const productService = {
    getAll: () => apiClient.get("/api/product/list"),
    getSingle: (id) => apiClient.get(`/api/product/single/${id}`),
};

export const profileService = {
    updateProfile: (data) => apiClient.put("/profile", data),
    getCloudinarySignature: () => apiClient.get("/cloudinary/signature"),
};

export default apiClient;