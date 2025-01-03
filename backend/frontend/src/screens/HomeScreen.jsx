// src/screens/HomeScreen.jsx
import React, { useEffect } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import ProductCard from '../components/ProductCard.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/productsSlice';
import TopProductCarosal from '../components/TopProductCarosal.jsx';

const HomeScreen = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);
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
    return (
        <>
            <div className='homePage my-5'>
                <h5>Top Rated products</h5>
                <TopProductCarosal products={products} />
                <h5>Latest Products</h5>
                <Row>
                    {products.map(product => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <ProductCard product={product} />
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    );
}

export default HomeScreen;