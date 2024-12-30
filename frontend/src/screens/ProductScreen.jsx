// src/screens/ProductScreen.jsx
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import { Col, Row, Image, ListGroup, Card, Spinner, Alert, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../features/productSlice';
import { addToCart } from '../features/cartSlice'; // Import the addToCart action
import Rating from '../components/Rating';
import ProductCard from '../components/ProductCard'; // Import the ProductCard component

const ProductScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.product);
  const [quantity, setQuantity] = useState(1);
  const [alert, setAlert] = useState(null); // State for alert message

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ id: product._id, name: product.name, price: product.price, quantity, image: product.image }));
    setAlert('Added to cart successfully!'); // Simplified alert message

    // Clear alert after 3 seconds
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    );
  }

  // Check if product is null
  if (!product) {
    return <Alert variant="warning" className="text-center">Product not found.</Alert>;
  }

  return (
    <div className="container product-screen">
      <Link to="/" className='btn btn-light my-3'>Go Back</Link>
      {alert && <Alert variant="success" className="text-center">{alert}</Alert>}
      <Row>
        <Col xs={12} md={6} className="mb-3">
          <Image src={product.image} alt={product.name} fluid className="product-image" />
        </Col>
        <Col xs={12} md={3} className="mb-3">
          <ListGroup variant='flush'>
            <ListGroup.Item><h3>{product.name}</h3></ListGroup.Item>
            <ListGroup.Item><Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} /></ListGroup.Item>
            <ListGroup.Item><strong>Price: ₹{product.price}</strong></ListGroup.Item>
            <ListGroup.Item>Description: {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col xs={12} md={3}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>₹{product.price}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>{product.countInstock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                </Row>
              </ListGroup.Item>
              {product.countInstock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                      >
                        {[...Array(product.countInstock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <Button
                  className={`btn-success w-100 ${product.countInstock === 0 ? 'btn-danger' : ''}`}
                  type='button'
                  disabled={product.countInstock === 0}
                  onClick={handleAddToCart}
                >
                  {product.countInstock === 0 ? 'Out of Stock' : 'Add To Cart'}
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;