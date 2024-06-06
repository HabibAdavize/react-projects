import { useState } from 'react'
import './App.scss'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Register />
    </>
  )
}

export default App
