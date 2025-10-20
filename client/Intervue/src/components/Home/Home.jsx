import React from 'react'
import Navbar from '../Navbar/Navbar'
import Main from '../Main/Main'
import Features from '../Features/Features'
import Steps from '../Steps/Steps'
import Footer from '../Footer/Footer'
import { useNavigate } from 'react-router-dom'
import api from '../../apiCalls/verifyCalls'
import { useEffect } from 'react'
import Header from '../Header/Header.jsx'


function Home() {
    const navigate = useNavigate()
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await api.get('/api/auth/verify');
        // If successful, the user is logged in, so redirect them.
        navigate('/dashboard');
      } catch (err) {
        // If it fails, do nothing. The user should see the home page.
      }
    };
    checkAuthStatus();
  }, [navigate]);

  return (
    <>
      <Navbar />
              <Header />
              <Main />
              <Features />
              <Steps />
              <Footer />
    </>
  )
}

export default Home