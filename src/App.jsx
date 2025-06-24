import React from 'react'
import { Routes, Route } from "react-router-dom";
import SignUp from './Pages/SignUp/SignUp';
import Cart from './Pages/Cart/Cart';
import CreateItem from './Pages/CreateItem/CreateItem';
import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import EditProducts from './Pages/EditProducts/EditProducts';
import MainLayout from './Layouts/MainLayout';
import './App.css';
import { ToastContainer } from 'react-toastify';
import Checkout from './Pages/Cart/Checkout';

const App = () => {
  const [token, setToken] = React.useState(false);

  if(token) {
    sessionStorage.setItem('token', JSON.stringify(token));
  }

  React.useEffect(() => {
    if(sessionStorage.getItem('token')) {
      let data = JSON.parse(sessionStorage.getItem('token'));
      setToken(data);
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home token={token} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/createitem" element={<CreateItem />} />
          <Route path="/edititem" element={<EditProducts />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App