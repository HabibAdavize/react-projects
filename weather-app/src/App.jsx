import { useState } from 'react'
import './App.css'
import weatherApp from './Components/Weather App/weatherApp'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <weatherApp/>
    </>
  )
}

export default App 
