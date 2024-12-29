import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
  return (
    <div>
      <Card className='my-3 p-3 rounded'>
               <Link to={`/product/${product._id}`} ><Card.Img src={product.image} /></Link>
        <Card.Body>
                  <Link to={`/product/${product._id}`} style={{'textDecoration':'none'}}><Card.Title as="div">
                          <strong >{product.name}</strong>
                    </Card.Title> </Link>            
            <Card.Text as="div">
                    <div className='my-3'>
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'}/>
                    </div>
            </Card.Text>
            <Card.Text as="h5">
                      Price: ₹{product.price}
            </Card.Text>
        </Card.Body>
      </Card>
    </div>

  )
}

export default ProductCard