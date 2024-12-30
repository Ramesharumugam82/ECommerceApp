import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Col, Row, Container, Card } from 'react-bootstrap';
import { saveShippingAddress } from '../features/cartSlice';

const ShippingScreen = ({ history }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    history.push('/payment');
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Card className="p-4 my-3">
            <h2>Shipping</h2>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='address' className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter address'
                  value={address}
                  required
                  onChange={(e) => setAddress(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='city' className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter city'
                  value={city}
                  required
                  onChange={(e) => setCity(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='postalCode' className="mb-3">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter postal code'
                  value={postalCode}
                  required
                  onChange={(e) => setPostalCode(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='country' className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter country'
                  value={country}
                  required
                  onChange={(e) => setCountry(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Button type='submit' variant='primary' className="w-100">
                Continue
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ShippingScreen;