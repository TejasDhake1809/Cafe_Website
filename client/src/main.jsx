import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from '../context/authContext.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
    </BrowserRouter>
    
  </StrictMode>,
)
