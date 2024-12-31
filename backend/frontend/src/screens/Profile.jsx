import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../features/updateSlice';
import { fetchUserProfile } from '../features/profileSlice';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import MyOrders from '../components/MyOrders'; // Assuming MyOrders component is in components folder

const Profile = () => {
    const dispatch = useDispatch();
    const { profileData, loading, error, successMessage } = useSelector((state) => state.update);
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
    
    // Initialize formData with userInfo values
    const [formData, setFormData] = useState({
        name: userInfo?.name || '',
        email: userInfo?.email || '',
        password: '',
        confirmPassword: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo')).token
            : null;

        if (token) {
            dispatch(fetchUserProfile(token));
        }
    }, [dispatch]);

    useEffect(() => {
        if (profileData) {
            setFormData({
                name: profileData.name || '',
                email: profileData.email || '',
                password: '',
                confirmPassword: '',
            });
        }
    }, [profileData]);

    useEffect(() => {
        if (successMessage || error) {
            const timer = setTimeout(() => {
                // Clear success message and error after 3 seconds
                dispatch({ type: 'update/clearMessages' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, error, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordClick = () => {
        setIsChangingPassword(true);
    };

    const handleUpdate = () => {
        if (isChangingPassword && formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const token = localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo')).token
            : null;

        if (token) {
            dispatch(updateUserProfile({ token, userData: formData }));
        }
        setIsEditing(false);
        setIsChangingPassword(false);

        // Update localStorage with new user info
        const updatedUserInfo = { ...userInfo, name: formData.name, email: formData.email };
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
    };

    const handleCancel = () => {
        setIsEditing(false);
        setIsChangingPassword(false);
        setFormData({
            name: profileData.name || userInfo?.name || '',
            email: profileData.email || userInfo?.email || '',
            password: '',
            confirmPassword: '',
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
        <Container>
            <Row>
                <Col xs={12} md={6}>
                    <h1>Profile</h1>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Form.Group>
                        {isEditing && (
                            <>
                                <Form.Group controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                {isChangingPassword && (
                                    <Form.Group controlId="formConfirmPassword">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                )}
                                
                            </>
                        )}
                        {isEditing ? (
                            <>
                                <Button variant="success" onClick={handleUpdate} className="me-2 my-2" style={{ marginLeft: '5px', }}>
                                    {isChangingPassword ? 'Change Password' : 'Update'}
                                </Button>
                                <Button variant="secondary" onClick={handleCancel} >
                                    Cancel
                                </Button>
                                <Button variant="warning" className="my-2" onClick={handlePasswordClick} style={{ margin: '10px', padding: '10px' }}>
                                    Change Password
                                </Button>
                            </>
                        ) : (
                            <Button variant="primary" className="my-2" onClick={() => setIsEditing(true)} >
                                Edit Profile
                            </Button>
                        )}
                        {successMessage && <Alert variant="success" className='my-2' style={{ marginTop: '10px' }}>{successMessage}</Alert>}
                        {error && <Alert variant="danger" className='my-2' style={{ marginTop: '10px' }}>{error}</Alert>}
                    </Form>
                </Col>
                <Col xs={12} md={6}>
                    <MyOrders />
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;