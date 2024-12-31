import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'; // Import from react-router-dom
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/login_Slice';
import { Badge } from 'react-bootstrap';
import logoImg  from '../assets/logo.jpg';

const Header = () => {
  const [cartItemCount, setCartItemCount] = useState(0);

  const updateCartItemCount = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setCartItemCount(itemCount);
  };

  useEffect(() => {
    updateCartItemCount();

    const handleStorageChange = () => {
      updateCartItemCount();
    };

    window.addEventListener('cartItemsUpdated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('cartItemsUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.login);
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Navbar expand="lg" fixed="top" className="bg-body-tertiary">
      <Container fluid className='mx-5'>
        <Navbar.Brand as={NavLink} to="/"><img src={logoImg} alt="logo" width={"32px"} hight={"32px"} /></Navbar.Brand>
        <Navbar.Brand as={NavLink} to="/">Village Hidden in Leaf</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto mx-5" style={{ maxHeight: '100px' }} navbarScroll>
            <NavDropdown title="Category" id="navbarScrollingDropdown">
              <NavDropdown.Item as={NavLink} to="/cat1">Category1</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/cat2">Category2</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={NavLink} to="catSomething">Something else here</NavDropdown.Item>
            </NavDropdown>
            <Form className="d-flex mx-3">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Nav>
          <Nav className="ms-auto mx-5" >
            <Nav.Link style={{ display: 'flex', alignItems: 'center' }} as={NavLink} to="/cart">
              <i style={{ fontSize: "18px" }} className="fas fa-shopping-cart"></i>
              <h6>
                <Badge style={{ fontSize: "10px" }} bg="secondary">{cartItemCount}</Badge>
              </h6>
            </Nav.Link>
            {userInfo ? (
              <NavDropdown title={`Hello, ${userInfo.name}! `} id="user-dropdown">
                <NavDropdown.Item as={NavLink} to="/profile/">Profile</NavDropdown.Item>
                <NavDropdown.Item as={Nav.Link} to="/" onClick={handleLogout}>
                  <i className='fas fa-sign-out-alt'></i> Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={NavLink} to="/login">
                <i className='fas fa-user'></i> Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;