import React from 'react'
import Homepage from './pages/Homepage'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Specialities from './pages/Specialities'
import Menu from './pages/Menu'
import Events from './pages/Events'
import Login from './pages/Login'
import Register from './pages/Register'
import AddItem from './pages/AddItem'
import Dashboard from './pages/Dashboard'
import ScrollToTop from './Components/ScrollTop'
import Order from './pages/Order'
import OrderReview from './pages/OrderReview'
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
  <>
    <ScrollToTop /> 
    <Toaster position="bottom-right" reverseOrder={false} />
    <Routes>
      
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/order' element={<Order />} />
      <Route path='/order-review' element={<OrderReview />} />
      <Route path='/' element={<MainLayout />}>
        <Route index element={<Homepage />}/>
        <Route path='/Specialities' element={<Specialities />}/>
        <Route path='/Menu' element={<Menu />}/>
        <Route path='/Events' element={<Events />}/>
        <Route path='/Login' element={<Login />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/add-item' element={<AddItem />} />
      </Route>
    </Routes>
  
  </>
  )
}

export default App