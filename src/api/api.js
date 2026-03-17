import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const backendUrl2 = import.meta.env.VITE_BACKEND_URL2;

const apiClient = axios.create({
    baseURL: backendUrl || backendUrl2,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
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
    getAll: (category, page, perPage, search) => {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (page) params.append('page', page);
        if (perPage) params.append('per_page', perPage);
        if (search) params.append('search', search);

        const paramString = params.toString();
        return apiClient.get(`/products${paramString ? `?${paramString}` : ""}`);
    },
    create: (data) => apiClient.post("/products", data),
    update: (id, data) => apiClient.put(`/products/${id}`, data),
    getOne: (id) => apiClient.get(`/products/${id}`),
    delete: (id) => apiClient.delete(`/products/${id}`),
};

export const categoryService = {
    getAll: () => apiClient.get("/categories"),
    create: (data) => apiClient.post("/categories", data),
    update: (id, data) => apiClient.put(`/categories/${id}`, data),
    delete: (id) => apiClient.delete(`/categories/${id}`),
};

export const adminService = {
    getDashboardStats: () => apiClient.get("/admin/dashboard"),
    getUsers: (page = 1, perPage = 10) => apiClient.get(`/admin/users?page=${page}&per_page=${perPage}`),
    updateUser: (id, data) => apiClient.put(`/admin/users/${id}`, data),
    getOrders: (page = 1, perPage = 10, status = '') => {
        const statusParam = status ? `&status=${status}` : '';
        return apiClient.get(`/admin/orders?page=${page}&per_page=${perPage}${statusParam}`);
    },
    getOrder: (id) => apiClient.get(`/admin/orders/${id}`),
    updateOrderStatus: (id, data) => apiClient.put(`/admin/orders/${id}`, data),
};

export const profileService = {
    updateProfile: (data) => apiClient.put("/profile", data),
    getCloudinarySignature: () => apiClient.get("/cloudinary/signature"),
    downloadProfile: () => apiClient.get("/profile/download", { responseType: 'blob' }),
};

export const cartService = {
    getCart: () => apiClient.get("/get-cart"),
    addToCart: (productId) => apiClient.post("/cart/add", { product_id: productId }),
    updateQuantity: (productId, quantity) => apiClient.post("/cart/update", { product_id: productId, quantity: quantity }),
};

export const planService = {
    getAll: () => apiClient.get("/plans"),
};

export const subscriptionService = {
    subscribe: (plan) => apiClient.post("/subscribe", { plan }),
};

export const orderService = {
    getOrders: (page = 1, perPage = 10) => apiClient.get(`/orders?page=${page}&per_page=${perPage}`),
    createCheckoutSession: (address) => apiClient.post("/orders/checkout", { address }),
};

export default apiClient;