// src/screens/ProductScreen.jsx
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Col, Row, Image, ListGroup, ListGroupItem, Card, Spinner, Alert, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../features/productSlice';
import { addToCart } from '../features/cartSlice'; // Import the addToCart action
import Rating from '../components/Rating';

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
    <div>
      <Link to="/" className='btn btn-light my-3'>Go Back</Link>
      {alert && <Alert variant="success" className="text-center">{alert}</Alert>} {/* Display alert message */}
      <Row>
        <Col md={6}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroupItem><h3>{product.name}</h3></ListGroupItem>
            <ListGroupItem><Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} /></ListGroupItem>
            <ListGroupItem><strong>Price: ${product.price}</strong></ListGroupItem>
            <ListGroupItem>Description: {product.description}</ListGroupItem>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroupItem>
                <Row>
                  <Col>Price:</Col>
                  <Col>${product.price}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Status:</Col>
                  <Col>{product.countInstock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                </Row>
              </ListGroupItem>

              <ListGroupItem>Select qty:
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
              </ListGroupItem>
              <ListGroupItem>
                <button
                  className='btn-block'
                  type='button'
                  disabled={product.countInstock === 0}
                  onClick={handleAddToCart}
                >
                  Add To Cart
                </button>
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;