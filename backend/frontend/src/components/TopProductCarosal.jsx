import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import './TopProductCarosal.css'; // Import custom CSS
import Rating from './Rating';

function TopProductCarosal({ products }) {
  if (!products || products.length === 0) {
    return null; // Return null if no products are provided
  }

  return (
    <Carousel data-bs-theme="dark" interval={2000} className="top-product-carousel">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
           <Carousel.Caption>
            <p className="carouselTittle">{product.name}</p>
          </Carousel.Caption>
          <Link to={`/product/${product._id}`}>
            <div className="carousel-image-wrapper">
              <Image src={product.image} alt={product.name} className="carousel-image" />
            </div>
          </Link>
          <Carousel.Caption className="carousel-caption">
            <Rating value={product.rating} color={'#FF9529'} />
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default TopProductCarosal;