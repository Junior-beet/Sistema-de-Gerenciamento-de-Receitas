import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'

import { createRoot } from 'react-dom/client'
import { App } from './App.jsx'
import { initTheme } from './services/theme.jsx'

initTheme()
createRoot(document.getElementById('app')).render(<App />)