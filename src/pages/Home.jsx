import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import MainBanner from '../components/MainBanner'
import Category from '../components/Category'
import BestSeller from '../components/BestSeller'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const Home = () => {
  const [searchParams] = useSearchParams();
  const { setToken, setUser } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // 1. Persist the login
      localStorage.setItem("token", token);
      setToken(token);
      setUser(true);

      // 2. Clean the URL so the token doesn't stay visible
      navigate("/", { replace: true });

      console.log("Social Login Successful!");
    }
  }, [searchParams, setToken, setUser, navigate]);

  return (
    <>
      <MainBanner />
      <Category />
      <BestSeller />
    </>
  )
}

export default Home
