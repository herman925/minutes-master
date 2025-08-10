import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
// Spark runtime removed – use local shim
import App from './App'
import '@/lib/sparkShim'
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <Toaster 
      position="top-right"
      toastOptions={{
        style: {
          background: 'var(--card)',
          color: 'var(--card-foreground)',
          border: '1px solid var(--border)',
        },
      }}
    />
  </>
)