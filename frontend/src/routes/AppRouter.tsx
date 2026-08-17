import { Routes, Route } from 'react-router-dom'
import LoginPage from '../components/auth/LoginPage';
import RegisterPage from '../components/auth/RegisterPage';
import HeroBaner from '../components/layout/HeroBaner';
import GoodsPage from '../components/goods/GoodsPage';
import WarehousesPage from '../components/warehouses/WarehousesPage';
import ProtectedRoute from './ProtectedRoute';

export default function AppRouter() {

  return (
    <>
    <Routes>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/' element={<HeroBaner/>}/>

      <Route path='/goods' element={<ProtectedRoute><GoodsPage/></ProtectedRoute>}/>
      <Route path='/warehouses' element={<ProtectedRoute><WarehousesPage/></ProtectedRoute>}/>
    </Routes>
    </>
  )
}
