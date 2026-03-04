import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

// Access the environment variable
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log(googleClientId);


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <AppContextProvider>
        <GoogleOAuthProvider clientId={googleClientId}>
          <App />
        </GoogleOAuthProvider>
      </AppContextProvider>
    </BrowserRouter>
)