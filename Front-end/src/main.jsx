import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'

import { createRoot } from 'react-dom/client'
import { App } from './App.jsx'

createRoot(document.getElementById('app')).render(<App />)