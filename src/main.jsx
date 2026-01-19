import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Import this
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter> {/* Wrap your App here */}
        <App />
    </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)