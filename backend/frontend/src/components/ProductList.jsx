import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/productsSlice';
import TopProductCarosal from './TopProductCarosal';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductList = () => {
  const dispatch = useDispatch();
  const productsState = useSelector((state) => state.products);
  const { products, loading, error } = productsState;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <TopProductCarosal products={products} />
      )}
    </div>
  );
};

export default ProductList;