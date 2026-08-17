import './App.css'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import HeroBaner from './components/layout/HeroBaner';

function App() {

  return (
    <>
    <Routes>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/' element={<HeroBaner/>}/>
    </Routes>
    </>
  )
}

export default App
