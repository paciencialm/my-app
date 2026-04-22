import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import AuthPage from './pages/AuthPage.tsx'
import DashboardPage from './pages/DashboardPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
