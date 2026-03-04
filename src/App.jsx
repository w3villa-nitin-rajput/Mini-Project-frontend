import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/Contact'
import Navbar from './components/Navbar'
import LoginPopup from './components/LoginPopup'
import { useAppContext } from './context/AppContext'
import { ToastContainer } from 'react-toastify'
import VerifyEmail from './components/VerifyEmail'
import Profile from './pages/Profile'

const App = () => {
  const IsSellerPath = useLocation().pathname.includes("seller")
  const { showUserLogin } = useAppContext()

  return (
    <div>
      {showUserLogin && <LoginPopup />}
      {IsSellerPath ? null : <Navbar />}

      <div className={`${IsSellerPath ? " " : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/verify' element={<VerifyEmail />} />
          <Route path='/profile' element={<Profile />} />
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
          theme="colored"
        />
      </div>

    </div>

  )
}

export default App
