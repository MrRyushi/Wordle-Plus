import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './Home'
import About from './About'
import Login from './Login'
import Register from './Register'
import Game from './Game'
import { Leaderboards } from './Leaderboards'

// None
function App() {

  return (
    <>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path='/about' element={<About />}/>
				<Route path='/login' element={<Login />}/>
				<Route path='/register' element={<Register />}/>
				<Route path='/game' element={<Game />}/>
				<Route path='/leaderboards' element={<Leaderboards />}/>
			</Routes>
		</BrowserRouter>
    </>
  )
}

export default App
