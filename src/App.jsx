import React, { useEffect } from 'react'
import { Routes, Route } from "react-router-dom";
import SignUp from './Pages/SignUp/SignUp';
import Cart from './Pages/Cart/Cart';
import CreateItem from './Pages/CreateItem/CreateItem';
import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import './App.css';
import EditProducts from './Pages/EditProducts/EditProducts';
import { ToastContainer } from 'react-toastify';

const App = () => {

  const [ token, setToken ] = React.useState(false);

  if(token) {
    sessionStorage.setItem('token', JSON.stringify(token));
  }

  useEffect(() => {
    if(sessionStorage.getItem('token')) {
      let data = JSON.parse(sessionStorage.getItem('token'));
      setToken(data);
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path={'/'} element={ <Login setToken={setToken} /> } />
        <Route path={'/signup'} element={ <SignUp/> } />
        <Route path={'/home'} element={ <Home token={token} /> } />   
        <Route path={'/cart'} element={ <Cart/> } />
        <Route path={'/createitem'} element={ <CreateItem /> } />
        <Route path={'/edititem'} element={ <EditProducts /> } />
      </Routes>
       <ToastContainer />
    </div>
  )
}

export default App