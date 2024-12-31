import React from 'react';
import { Card } from 'react-bootstrap';
import Rating from './Rating';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Styled components
const StyledCard = styled(Card)`
  margin: 0.5rem;
  border-radius: 0.5rem;
  overflow: hidden; /* Ensures that the card content does not overflow */
  height: 350px; /* Fixed height for uniformity */
  display: flex;
  flex-direction: column; /* Ensure the card content stacks vertically */
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 200px; /* Fixed height for the image wrapper */
  overflow: hidden; /* Hide overflow */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardImage = styled.img`
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
`;

const CardTitle = styled(Card.Title)`
  color: black;
  text-decoration: none;
  border: none; 
`;

const CardBody = styled(Card.Body)`
  padding: 1rem; 
  flex-grow: 1; 
`;

const PriceText = styled(Card.Text)`
  font-size: 1.1rem; /* Adjust font size for better readability */
  `;

const ProductCard = ({ product }) => {
  return (
    <StyledCard>
      <Link to={`/product/${product._id}`}>
        <ImageWrapper>
          <CardImage src={product.image} alt={product.name} style={{objectFit:'fill'}}/>
        </ImageWrapper>
      </Link>
      <CardBody>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <CardTitle as="div" >
            <strong ><span style={{color:"#525150"}}>{product.name}</span></strong>
          </CardTitle>
        </Link>
        <Card.Text as="div">
          <div className='my-2'>
            <Rating style={{color:"#525150"}} value={product.rating} text={`${product.numReviews} reviews`} color={'#FF9529'} />
          </div>
        </Card.Text>
        <PriceText as="h5" style={{color:"#525150"}}>
          Price: ₹{product.price}
        </PriceText>
      </CardBody>
    </StyledCard>
  );
}

export default ProductCard;