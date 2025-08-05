import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import "@github/spark/spark"
import App from './App'
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