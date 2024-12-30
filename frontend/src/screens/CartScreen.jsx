// src/screens/CartScreen.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ListGroup, Button, Alert, Card, Form } from 'react-bootstrap';
import { removeFromCart, addToCart } from '../features/cartSlice'; // Import actions
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa'; // Import icons

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
        }
    };

    const handleQuantityChange = (item, quantity) => {
        dispatch(addToCart({ ...item, quantity: quantity - item.quantity })); // Set quantity
    };

    const navigate = useNavigate();
    const handleProceedToShipping = () => {
        navigate('/shipping');
    }

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
                                        <Button variant="secondary" className="btn-sm" onClick={() => handleDecreaseQuantity(item)}>
                                            <FaMinus />
                                        </Button>
                                        <Form.Select
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item, Number(e.target.value))}
                                            className="mx-2"
                                            style={{ width: '60px' }}
                                        >
                                            {[...Array(10).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Button variant="secondary" className="btn-sm" onClick={() => handleIncreaseQuantity(item)}>
                                            <FaPlus />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="btn-sm ms-2"
                                            onClick={() => handleRemoveFromCart(item.id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                    <h2 className="mt-3">Total Price: ₹{totalPrice.toFixed(2)}</h2>
                    <Button
                        variant="success"
                        className="mt-3"
                        onClick={handleProceedToShipping}
                        disabled={items.length === 0 || !userInfo} // Disable if cart is empty or user is not logged in
                    >
                        Proceed to Checkout
                    </Button>
                    {!userInfo && <Alert variant="warning" className="mt-3">Please log in to proceed to checkout.</Alert>}
                </>
            )}
        </div>
    );
};

export default CartScreen;