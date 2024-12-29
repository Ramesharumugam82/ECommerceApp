import React from 'react';
import { NavLink } from 'react-router-dom'; // Import from react-router-dom
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/login_Slice'; 

const Header = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state ) => state.login); 

  const handleLogout = () => {
    dispatch(logout()); 
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/">Village Hidden in Leaf</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="mr-auto" style={{ maxHeight: '100px' }} navbarScroll>
            <NavDropdown title="Category" id="navbarScrollingDropdown">
              <NavDropdown.Item as={NavLink} to="/cat1">cat1</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/cat2">cat2</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={NavLink} to="catSomething">Something else here</NavDropdown.Item>
            </NavDropdown>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
            <Nav.Link as={NavLink} to="/cart"><i className="fas fa-shopping-cart"></i> Cart</Nav.Link>
            {userInfo ? (
              <NavDropdown title={`Hello, ${userInfo.name}!`} id="user-dropdown">
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