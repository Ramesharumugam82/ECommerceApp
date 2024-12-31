import React from 'react';
import Header from './components/Header'; 
import Footer from './components/Footer'; 
import './App.css';
import HomeScreen from './screens/HomeScreen';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginForm from './screens/LoginForm';
import Profile from './screens/Profile';
import ShipingScreen from './screens/ShippingScreen';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/' element={<HomeScreen />} /> 
            <Route path='/product/:id' element={<ProductScreen />} /> 
            <Route path="/cart" element={<CartScreen />} />
            <Route path='/login' element={<LoginForm />} />
            <Route path='/profile' element={<Profile />} />
            <Route path="/shipping" element ={<ShipingScreen/>}/>
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;