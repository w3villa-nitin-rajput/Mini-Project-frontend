import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Pricing from './pages/Pricing'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import Checkout from './pages/Checkout'
import Navbar from './components/Navbar'
import LoginPopup from './components/LoginPopup'
import { useAppContext } from './context/AppContext'
import { ToastContainer } from 'react-toastify'
import VerifyEmail from './components/VerifyEmail'
import Profile from './pages/Profile'
import MyOrders from './pages/MyOrders'
import Footer from './components/Footer'

// Admin Pages
import AdminLayout from './pages/seller/AdminLayout'
import Dashboard from './pages/seller/Dashboard'
import UsersList from './pages/seller/UsersList'
import ProductsManager from './pages/seller/ProductsManager'
import CategoriesManager from './pages/seller/CategoriesManager'
import OrdersManager from './pages/seller/OrdersManager'

const App = () => {
  const IsSellerPath = useLocation().pathname.includes("seller")
  const { showUserLogin } = useAppContext()

  return (
    <div className={IsSellerPath ? "bg-gray-900 min-h-screen text-white" : ""}>
      {showUserLogin && <LoginPopup />}
      {IsSellerPath ? null : <Navbar />}

      <div className={`${IsSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products />} />
          <Route path='/products/:id' element={<ProductDetail />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/payment-success' element={<PaymentSuccess />} />
          <Route path='/payment-cancel' element={<PaymentCancel />} />
          <Route path='/verify' element={<VerifyEmail />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/myOrders' element={<MyOrders />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />

          {/* Admin Routes */}
          <Route path='/seller' element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='users' element={<UsersList />} />
            <Route path='categories' element={<CategoriesManager />} />
            <Route path='products' element={<ProductsManager />} />
            <Route path='orders' element={<OrdersManager />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>

      {IsSellerPath ? null : <Footer />}
    </div>

  )
}

export default App
