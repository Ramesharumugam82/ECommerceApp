// src/screens/CartScreen.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ListGroup, Button, Alert, Card } from 'react-bootstrap';
import { removeFromCart, addToCart } from '../features/cartSlice'; // Import actions

const CartScreen = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.cart); // Access cart items
    const { userInfo } = useSelector((state) => state.login); // Access user info

    const handleRemoveFromCart = (id) => {
        dispatch(removeFromCart(id)); // Dispatch action to remove item
    };

    const handleIncreaseQuantity = (item) => {
        dispatch(addToCart({ ...item, quantity: 1 })); // Increase quantity
    };

    const handleDecreaseQuantity = (item) => {
        if (item.quantity > 1) {
            dispatch(addToCart({ ...item, quantity: -1 })); // Decrease quantity
        } else {
            handleRemoveFromCart(item.id); // Remove item if quantity is 1
        }
    };

    // Calculate total price
    const totalPrice = items.reduce((acc, item) => {
        const price = parseFloat(item.price); // Ensure price is a number
        return acc + (isNaN(price) ? 0 : price * item.quantity); // Handle NaN case
    }, 0);

    return (
        <div className="container mt-5">
            <h1>Your Cart</h1>
            {userInfo && (
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Title>Welcome, {userInfo.name}!</Card.Title>
                        <Card.Text>
                            Email: {userInfo.email || "Not provided"}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
            {items.length === 0 ? (
                <Alert variant="info">Your cart is empty</Alert>
            ) : (
                <>
                    <ListGroup>
                        {items.map((item) => {
                            const price = parseFloat(item.price); // Ensure price is a number
                            return (
                                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <img src={item.image || "https://via.placeholder.com/50"} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />
                                        <div>
                                            <div>{item.name}</div>
                                            <div>${isNaN(price) ? "N/A" : price.toFixed(2)}</div> {/* Handle NaN case */}
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Button variant="secondary" className="btn-sm" onClick={() => handleDecreaseQuantity(item)}>-</Button>
                                        <span className="mx-2">{item.quantity}</span>
                                        <Button variant="secondary" className="btn-sm" onClick={() => handleIncreaseQuantity(item)}>+</Button>
                                        <Button
                                            variant="danger"
                                            className="btn-sm ms-2"
                                            onClick={() => handleRemoveFromCart(item.id)}
                                        >
                                            X
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                    <h2 className="mt-3">Total Price: ${totalPrice.toFixed(2)}</h2>
                    <Button variant="success" className="mt-3">Proceed to Checkout</Button>
                </>
            )}
        </div>
    );
};

export default CartScreen;