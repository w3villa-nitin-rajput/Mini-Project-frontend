import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { userService, profileService, productService, categoryService, cartService, subscriptionService, planService } from "../api/api";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = "₹";

  const [token, setToken] = useState(localStorage.getItem('token') || "");
  const [user, setUser] = useState(!!localStorage.getItem('token'));
  const [showUserLogin, setShowUserLogin] = useState(false);

  // Profile state
  const [userData, setUserData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Product & Category state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [plans, setPlans] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Cart state
  const [cartItems, setCartItems] = useState(localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : {});

  // --- Profile Methods ---
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

  // --- Product & Category Methods ---
  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  const fetchPlans = useCallback(async () => {
    try {
      const response = await planService.getAll();
      setPlans(response.data);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
  }, []);

  const fetchProducts = useCallback(async (category) => {
    console.log("fetchProducts");
    try {
      const response = await productService.getAll(category);
      // The API now returns { products: [...], meta: {...} }
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }, []);

  // --- Cart Methods ---
  const getUserCart = useCallback(async () => {
    try {
      const response = await cartService.getCart();
      if (response.data && response.data.cartItems) {
        setCartItems(response.data.cartItems);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  }, []);

  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);

    if (token) {
      try {
        await cartService.addToCart(itemId);
        // We could also re-fetch the entire cart to ensure consistency
        // await getUserCart();
        toast.success("Product added to cart");
      } catch (error) {
        toast.error(error.message || "Failed to add to cart");
      }
    } else {
      toast.success("Product added to cart");
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity <= 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);

    if (token) {
      try {
        await cartService.updateQuantity(itemId, quantity);
        // await getUserCart();
      } catch (error) {
        toast.error(error.message || "Failed to update quantity");
      }
    }
  }

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      try {
        if (cartItems[items] > 0) {
          totalCount += cartItems[items];
        }
      } catch (error) {
        console.error(error);
      }
    }
    return totalCount;
  }

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => (product._id || product.id).toString() === items.toString());
      if (!itemInfo) {
        // Fallback to dummy data if not found in current fetched products
        // In a real app, you might need to fetch missing items
        continue;
      }
      try {
        if (cartItems[items] > 0) {
          const price = itemInfo.offer_price || itemInfo.offerPrice || itemInfo.price;
          totalAmount += Number(price) * cartItems[items];
        }
      } catch (error) {
        console.error(error);
      }
    }
    return totalAmount;
  }

  const subscribe = async (plan) => {
    try {
      const response = await subscriptionService.subscribe(plan);
      return response.data; // This will now contain checkout_url
    } catch (error) {
      toast.error(error || "Subscription failed");
      throw error;
    }
  };

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Load categories & products on mount (public data, no token needed)
  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      await Promise.all([fetchCategories(), fetchProducts(), fetchPlans()]);
      setDataLoading(false);
    };
    loadData();
  }, [fetchCategories, fetchProducts, fetchPlans]);

  // Load user profile and cart when token is set
  useEffect(() => {
    if (token) {
      loadUserProfileData();
      getUserCart();
    } else {
      setUserData(null);
      // Optional: Clear cart on logout? 
      // Usually good to keep local cart but clear backend reference
    }
  }, [token, loadUserProfileData, getUserCart]);

  const value = {
    currency,
    token, setToken,
    user, setUser,
    showUserLogin, setShowUserLogin,
    backendUrl,
    userData, setUserData,
    loadUserProfileData, updateProfile,
    profileLoading,
    products, categories, plans,
    fetchProducts, fetchCategories, fetchPlans,
    dataLoading,
    cartItems, setCartItems,
    addToCart, updateQuantity,
    getCartCount, getCartAmount,
    subscribe,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);