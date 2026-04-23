import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CurrencyDashboard from './pages/CurrencyDashboard.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CurrencyDashboard />
  </StrictMode>,
)
